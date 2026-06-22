import 'reflect-metadata';
import LogoutService from '@modules/users/services/LogoutService';
import FakeCacheProvider from '../../../providers/fakes/FakeCacheProvider';
import FakeLogProvider from '../../../providers/fakes/FakeLogProvider';
import FakeUserTokenRepository from '../repositories/FakeUsersTokensRepository';

let logoutService: LogoutService;
let fakeCacheProvider: FakeCacheProvider;
let fakeUserTokensRepository: FakeUserTokenRepository;
let fakeLogProvider: FakeLogProvider;

describe('Logout', () => {
  beforeEach(() => {
    fakeCacheProvider = new FakeCacheProvider();
    fakeUserTokensRepository = new FakeUserTokenRepository();
    fakeLogProvider = new FakeLogProvider();
    logoutService = new LogoutService(
      fakeCacheProvider,
      fakeUserTokensRepository,
      fakeLogProvider
    );
  });

  it('should be able to logout and invalidate session', async () => {
    const userId = 'user-123';
    await fakeCacheProvider.save(`session:${userId}`, 'some-jti');
    await fakeUserTokensRepository.save({ user_id: userId, token: 'some-jti' });

    await logoutService.execute(userId);

    const session = await fakeCacheProvider.recover(`session:${userId}`);
    expect(session).toBeNull();

    const dbToken = await fakeUserTokensRepository.findByToken('some-jti');
    expect(dbToken).toBeUndefined();
  });

  it('should not delete password reset tokens on logout', async () => {
    const userId = 'user-123';
    await fakeCacheProvider.save(`session:${userId}`, 'session-jti');
    await fakeUserTokensRepository.save({
      user_id: userId,
      token: 'session-jti',
    });
    await fakeUserTokensRepository.save({
      user_id: userId,
      token: 'reset-token',
    });

    await logoutService.execute(userId);

    const resetToken =
      await fakeUserTokensRepository.findByToken('reset-token');
    expect(resetToken).toBeDefined();
  });

  it('should not throw when logging out without active session', async () => {
    await expect(
      logoutService.execute('non-existent-user')
    ).resolves.not.toThrow();
  });
});
