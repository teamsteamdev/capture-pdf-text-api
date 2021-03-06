/* eslint-env jest */

import { Block } from '../src/class.block'
import { Item } from '../src/class.item'
import { matchWith } from '../src/matcher'
import { sameBlock, sameLine } from '../src/rules'

describe('sameBlock', () => {
  test('matches items that have same style and are neighbors', () => {
    const partial = matchWith(sameBlock())

    const item1 = { lineHeight: 12, fontName: 'Times' }
    const item2 = { lineHeight: 13, fontName: 'Times' }
    const item4 = { lineHeight: 12, fontName: 'Arial' }
    expect(partial(item1, item2)).toBe(false)
    expect(partial(item1, item4)).toBe(false)

    const item5 = {
      left: 1,
      right: 11,
      bottom: 1,
      top: 2,
      width: 10,
      lineHeight: 12,
      height: 12,
      fontName: 'Arial',
    }
    const item6 = {
      left: 2,
      right: 3,
      bottom: 3,
      top: 12,
      width: 1,
      lineHeight: 12,
      height: 12,
      fontName: 'Arial',
    }
    expect(partial(item5, item6)).toBe(true)
  })

  test('it matches blocks to items', () => {
    const item1 = new Item({
      str: 'item1',
      dir: 'ltr',
      width: 50,
      height: 12,
      transform: [12, 0, 0, 12, 0, 0],
      fontName: 'Helvetica',
    })
    const item2 = new Item({
      str: 'item2',
      dir: 'ltr',
      width: 50,
      height: 12,
      transform: [12, 0, 0, 12, 50, 0],
      fontName: 'Helvetica',
    })
    const item3 = new Item({
      str: 'item3',
      dir: 'ltr',
      width: 50,
      height: 12,
      transform: [12, 0, 0, 12, 100, 0],
      fontName: 'Helvetica',
    })

    const block = Block.from(item1, item2)
    const partial = matchWith(sameLine())
    const result = partial(block, item3)
    expect(result).toBe(true)
  })
  test('match items that are left aligned', () => {
    const partial = matchWith(sameBlock(1, 2))
    const item1 = {
      left: 1,
      right: 20,
      bottom: 1,
      top: 4,
      width: 19,
      lineHeight: 3,
      height: 3,
      fontName: 'Arial',
    }
    const item2 = {
      left: 2,
      right: 20,
      bottom: 6,
      top: 9,
      width: 19,
      lineHeight: 3,
      height: 3,
      fontName: 'Arial',
    }
    const item3 = {
      left: 5,
      right: 20,
      bottom: 6,
      top: 9,
      width: 19,
      lineHeight: 3,
      height: 3,
      fontName: 'Arial',
    }
    expect(partial(item1, item2)).toBe(true)
    expect(partial(item1, item3)).toBe(false)
  })
})
