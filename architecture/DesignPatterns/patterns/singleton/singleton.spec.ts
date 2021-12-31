import { Singleton } from "./singleton"

it('singleton', () => {
    expect(Singleton.getInstance()).toBe(Singleton.getInstance())
})