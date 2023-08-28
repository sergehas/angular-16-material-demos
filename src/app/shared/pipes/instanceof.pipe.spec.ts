import { InstanceofPipe } from './instanceof.pipe';

describe('InstanceofPipe', () => {
  it('create an instance', () => {
    const pipe = new InstanceofPipe();
    expect(pipe).toBeTruthy();
  });
});
