import { NFCCard, NFCWriteResult, CardDesign } from '../types/index';
import { nfcRepository } from '../repositories/NFCRepository';
import { linkPageRepository } from '../repositories/LinkPageRepository';
import { NotFoundError, AuthorizationError } from '../utils/errors';

export class NFCService {
  async getUserCards(userId: string): Promise<NFCCard[]> {
    return nfcRepository.findByUserId(userId);
  }

  async getCard(cardId: string, userId: string): Promise<NFCCard> {
    const card = await nfcRepository.findById(cardId);
    
    if (!card) {
      throw new NotFoundError('NFC Card');
    }

    // Verify ownership by checking if the user owns the page this card belongs to
    if (card.pageId) {
      const page = await linkPageRepository.findById(card.pageId);
      if (!page || page.userId !== userId) {
        throw new AuthorizationError('You do not own this NFC card');
      }
    } else {
      // If it has no pageId, we can't verify ownership, or maybe it's globally unowned?
      // Since our UI always passes pageId, we assume it should be owned.
      throw new AuthorizationError('Invalid NFC card association');
    }

    return card;
  }

  async createCard(
    userId: string,
    data: { title: string; description?: string; tagId?: string; isActive?: boolean; pageId?: string }
  ): Promise<NFCCard> {
    let actualPageId = data.pageId;

    // Handle frontend bug where user.id is passed as pageId
    if (data.pageId === userId) {
      const result = await linkPageRepository.list(userId, 0, 1);
      if (result.pages.length > 0) {
        actualPageId = result.pages[0].id;
      } else {
        actualPageId = undefined; // Will be set to null in repository
      }
    }

    return nfcRepository.create({
      userId,
      pageId: actualPageId,
      title: data.title,
      description: data.description,
      tagId: data.tagId,
      isActive: data.isActive ?? true,
    });
  }

  async updateCard(
    cardId: string,
    userId: string,
    updates: Partial<NFCCard>
  ): Promise<NFCCard> {
    // Verify ownership
    await this.getCard(cardId, userId);

    const updated = await nfcRepository.update(cardId, updates);
    if (!updated) {
      throw new NotFoundError('NFC Card');
    }

    return updated;
  }

  async deleteCard(cardId: string, userId: string): Promise<void> {
    // Verify ownership
    await this.getCard(cardId, userId);
    
    await nfcRepository.delete(cardId);
  }

  async toggleActive(cardId: string, userId: string): Promise<NFCCard> {
    const card = await this.getCard(cardId, userId);
    
    const updated = await nfcRepository.update(cardId, {
      isActive: !card.isActive
    });

    if (!updated) {
      throw new NotFoundError('NFC Card');
    }

    return updated;
  }

  async writeTag(cardId: string, userId: string, tagId: string): Promise<NFCWriteResult> {
    // Verify ownership
    await this.getCard(cardId, userId);

    // In a real implementation, this would interact with a hardware layer 
    // or an external service. For now, we update the database to link the tag.
    await nfcRepository.update(cardId, { tagId });

    return {
      success: true,
      message: 'Successfully linked and wrote to NFC tag',
      tagId,
      writtenData: {
        id: tagId,
        type: 'NDEF',
        records: [
          {
            tnf: 1,
            type: 'U',
            payload: `https://linkora.com/n/${cardId}` // Example payload
          }
        ]
      }
    };
  }
  async saveDesign(cardId: string, userId: string, cardDesign: CardDesign): Promise<NFCCard> {
    await this.getCard(cardId, userId);
    const updated = await nfcRepository.saveDesign(cardId, cardDesign);
    if (!updated) throw new NotFoundError('NFC Card');
    return updated;
  }
}

export const nfcService = new NFCService();
