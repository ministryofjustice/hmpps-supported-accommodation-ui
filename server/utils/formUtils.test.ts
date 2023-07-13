import { escape, convertKeyValuePairToRadioItems } from './formUtils'

describe('formutils', () => {
  describe('escape', () => {
    it('escapes HTML tags', () => {
      expect(escape('<b>Formatted text</b>')).toEqual('&lt;b&gt;Formatted text&lt;/b&gt;')
    })

    it('escapes reserved characters', () => {
      expect(escape('"Quoted text"')).toEqual('&quot;Quoted text&quot;')
    })

    it('returns the empty string when given null', () => {
      expect(escape(null)).toEqual('')
    })
  })

  describe('convertKeyValuePairToRadioItems', () => {
    const obj = {
      foo: 'Foo',
      bar: 'Bar',
    }

    it('should convert a key value pair to radio items', () => {
      expect(convertKeyValuePairToRadioItems(obj, '')).toEqual([
        {
          value: 'foo',
          text: 'Foo',
          checked: false,
        },
        {
          value: 'bar',
          text: 'Bar',
          checked: false,
        },
      ])
    })

    it('should check the checked item', () => {
      expect(convertKeyValuePairToRadioItems(obj, 'foo')).toEqual([
        {
          value: 'foo',
          text: 'Foo',
          checked: true,
        },
        {
          value: 'bar',
          text: 'Bar',
          checked: false,
        },
      ])

      expect(convertKeyValuePairToRadioItems(obj, 'bar')).toEqual([
        {
          value: 'foo',
          text: 'Foo',
          checked: false,
        },
        {
          value: 'bar',
          text: 'Bar',
          checked: true,
        },
      ])
    })
  })
})
