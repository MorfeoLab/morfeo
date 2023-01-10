import { OnlyBooleanPipe } from './only-boolean.pipe';

describe('OnlyBooleanPipe', () => {
  it('create an instance', () => {
    const pipe = new OnlyBooleanPipe();
    expect(pipe).toBeTruthy();
  });
});
