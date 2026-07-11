import sys
from PIL import Image

def remove_black_background(input_path, output_path, tolerance=50):
    img = Image.open(input_path).convert("RGBA")
    datas = img.getdata()

    newData = []
    for item in datas:
        # Check if pixel is dark (black/near black)
        if item[0] < tolerance and item[1] < tolerance and item[2] < tolerance:
            # Change to transparent
            newData.append((255, 255, 255, 0))
        else:
            newData.append(item)

    img.putdata(newData)
    img.save(output_path, "PNG")

if __name__ == "__main__":
    remove_black_background(sys.argv[1], sys.argv[2])
