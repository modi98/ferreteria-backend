import { Client } from '.'
import { User } from '../user'

let user, client

beforeEach(async () => {
  user = await User.create({ email: 'a@a.com', password: '123456' })
  client = await Client.create({ createdBy: user, name: 'test', email: 'test', phone: 'test', direction: 'test' })
})

describe('view', () => {
  it('returns simple view', () => {
    const view = client.view()
    expect(typeof view).toBe('object')
    expect(view.id).toBe(client.id)
    expect(typeof view.createdBy).toBe('object')
    expect(view.createdBy.id).toBe(user.id)
    expect(view.name).toBe(client.name)
    expect(view.email).toBe(client.email)
    expect(view.phone).toBe(client.phone)
    expect(view.direction).toBe(client.direction)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })

  it('returns full view', () => {
    const view = client.view(true)
    expect(typeof view).toBe('object')
    expect(view.id).toBe(client.id)
    expect(typeof view.createdBy).toBe('object')
    expect(view.createdBy.id).toBe(user.id)
    expect(view.name).toBe(client.name)
    expect(view.email).toBe(client.email)
    expect(view.phone).toBe(client.phone)
    expect(view.direction).toBe(client.direction)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })
})
