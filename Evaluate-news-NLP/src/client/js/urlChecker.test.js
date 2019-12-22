import{ checkURL } from './urlChecker'

test('Is a valid url', () => {
  expect(checkURL('https://www.google.com')).toBeTruthy()
})
