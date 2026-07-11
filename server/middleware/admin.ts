import { Request, Response, NextFunction } from 'express'
import { supabase } from '../utils/supabase'

export type AdminRole = 'super_admin' | 'admin' | 'editor' | 'support' | 'designer' | 'viewer'

const ROLE_HIERARCHY: Record<AdminRole, number> = {
  super_admin: 6,
  admin: 5,
  editor: 4,
  designer: 3,
  support: 2,
  viewer: 1,
}

export interface AdminRequest extends Request {
  adminUser?: { id: string; role: AdminRole; email: string }
}

export function requireRole(...allowedRoles: AdminRole[]) {
  return async (req: AdminRequest, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization
      if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, error: 'No token provided' })
      }

      const token = authHeader.split(' ')[1]
      const { data: { user }, error: authError } = await supabase.auth.getUser(token)
      if (authError || !user) {
        return res.status(401).json({ success: false, error: 'Invalid token' })
      }

      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('id, role, email')
        .eq('id', user.id)
        .single()

      if (profileError || !profile) {
        return res.status(401).json({ success: false, error: 'User not found' })
      }

      const userRole = (profile.role || 'user') as AdminRole

      if (userRole === 'user') {
        return res.status(403).json({ success: false, error: 'Admin access required' })
      }

      if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
        return res.status(403).json({ success: false, error: 'Insufficient permissions' })
      }

      req.adminUser = { id: profile.id, role: userRole, email: profile.email }
      next()
    } catch (err) {
      return res.status(500).json({ success: false, error: 'Authorization failed' })
    }
  }
}

export function requireMinRole(minRole: AdminRole) {
  return async (req: AdminRequest, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization
      if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, error: 'No token provided' })
      }

      const token = authHeader.split(' ')[1]
      const { data: { user }, error: authError } = await supabase.auth.getUser(token)
      if (authError || !user) {
        return res.status(401).json({ success: false, error: 'Invalid token' })
      }

      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('id, role, email')
        .eq('id', user.id)
        .single()

      if (profileError || !profile) {
        return res.status(401).json({ success: false, error: 'User not found' })
      }

      const userRole = (profile.role || 'user') as AdminRole
      const userLevel = ROLE_HIERARCHY[userRole] || 0
      const requiredLevel = ROLE_HIERARCHY[minRole] || 0

      if (userLevel < requiredLevel) {
        return res.status(403).json({ success: false, error: `Minimum role required: ${minRole}` })
      }

      req.adminUser = { id: profile.id, role: userRole, email: profile.email }
      next()
    } catch (err) {
      return res.status(500).json({ success: false, error: 'Authorization failed' })
    }
  }
}
