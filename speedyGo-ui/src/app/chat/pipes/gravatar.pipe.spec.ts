import { GravatarPipe } from './gravatar.pipe';

describe('GravatarPipe', () => {
  it('create an instance', () => {
    const pipe = new GravatarPipe();
    expect(pipe).toBeTruthy();
  });
});
