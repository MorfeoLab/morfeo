import { StringToHtmlPipe } from './string-to-html.pipe';

describe('StringToHtmlPipe', () => {
  it('create an instance', () => {
    const pipe = new StringToHtmlPipe();
    expect(pipe).toBeTruthy();
  });
});
