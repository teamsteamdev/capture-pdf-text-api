/* eslint-env jest */
// import fs from 'fs'
import flow from 'lodash/fp/flow'

import { Block } from '../src/class.block'
import { Item } from '../src/class.item'
import {
  makeBlocks,
  makeBlockWith,
} from '../src/matcher.recursive'
import { sameBlock, sameLine } from '../src/matcher.rules'

import singleParagraph from './fixtures/single-paragraph.json'
import multiParagraph from './fixtures/multi-paragraph.json'

describe('makeBlocks', () => {
  test('it returns an array of blocks', () => {
    const [item1] = singleParagraph.pages[0].map(
      item => new Item(item),
    )
    const partial = makeBlocks(sameBlock())
    expect(partial).toBeInstanceOf(Function)
    const result = partial([item1])
    expect(result).toBeInstanceOf(Array)
    expect(result.length).toBe(1)
    expect(result[0]).toBeInstanceOf(Block)
    expect(result[0].items.length).toBe(1)
    expect(result[0].items[0]).toBe(item1)
  })
  test('makes five paragraphs', () => {
    const items = multiParagraph.pages[0].map(
      item => new Item(item),
    )
    // fs.writeFileSync(
    //   './tests/fixtures/multi-paragraph-items.json',
    //   JSON.stringify(items, null, 2),
    // )
    const partial = flow(
      makeBlocks(sameLine()),
      makeBlocks(sameBlock()),
    )
    const result = partial(items)
    expect(result.length).toBe(5)
  })
})

describe('makeBlockWith', () => {
  test('it groups correctly', () => {
    const [item1, item2, item3] = singleParagraph.pages[0].map(
      item => new Item(item),
    )
    const partial = makeBlockWith(sameBlock())
    expect(partial).toBeInstanceOf(Function)
    const result = partial({
      items: [item1, item3],
      block: item2,
    })
    expect(result).toHaveProperty('items')
    expect(result).toHaveProperty('block')
    const { items, block } = result
    expect(block.items.length).toBe(3)
    expect(items.length).toBe(0)
    expect(block.items).toContain(item2)
    expect(block.items).toContain(item3)
    expect(block.items).toContain(item1)
  })
  test('it climbs the ladder', () => {
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

    const partial = makeBlockWith(sameLine())
    const result = partial({
      items: [item2, item3],
      block: item1,
    }).block
    expect(result).toBeInstanceOf(Block)
    expect(result.items).toContain(item1)
    expect(result.items).toContain(item2)
    expect(result.items).toContain(item3)
  })
  test('it groups multi paragraph', () => {
    const [item, ...items] = multiParagraph.pages[0].map(
      item => new Item(item),
    )
    // fs.writeFileSync(
    //   './tests/fixtures/multi-paragraph-items.json',
    //   JSON.stringify(items, null, 2),
    // )
    const partial = makeBlockWith(sameBlock())
    const result = partial({ items, block: item }).block
    expect(result).toBeInstanceOf(Block)

    expect(
      result.items.filter(
        ({ text }) => text === 'uras brisas te cruzan también',
      ),
    ).toBeDefined()
  })
})
