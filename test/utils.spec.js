import { describe, it, expect } from 'vitest'
import { readyToSave } from '../utils/index.js'

describe('Utils Test', () => {
  it('should not be ready to save if any condition is true', () => {
    expect(readyToSave([{"condition": () => true, "msg": "not ready"}]))
      .toStrictEqual({"ready": false, "msg": "not ready"})
  })

  it('should be ready to save if any condition is false', () => {
    expect(readyToSave([{"condition": () => false, "msg": "not ready"}]))
      .toStrictEqual({"ready": true, "msg": ""})
  })
});
