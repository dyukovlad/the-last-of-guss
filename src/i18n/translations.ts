export const translations = {
  ru: {
    login: {
      title: 'Вход в The Last of Guss',
      usernameLabel: 'Имя пользователя',
      passwordLabel: 'Пароль',
      loginButton: 'Войти',
      loading: 'Вход...'
    },
    rounds: {
      title: 'Список РАУНДОВ',
      createButton: 'Создать раунд',
      noRounds: 'Нет доступных раундов.',
      loading: 'Загрузка раундов...',
      status: {
        active: 'Активен',
        cooldown: 'Cooldown',
        finished: 'Завершен'
      }
    },
    round: {
      myPoints: 'Мои очки',
      tapButton: 'НАЖМИ МЕНЯ!',
      backToList: 'Назад к раундам',
      winner: 'Победитель',
      total: 'Всего'
    },
    errors: {
      loginFailed: 'Не удалось войти. Проверьте имя пользователя и пароль.',
      networkError: 'Ошибка сети. Проверьте подключение и повторите попытку.'
    }
  },
  en: {
    login: {
      title: 'Sign in to The Last of Guss',
      usernameLabel: 'Username',
      passwordLabel: 'Password',
      loginButton: 'Sign In',
      loading: 'Signing in...'
    },
    rounds: {
      title: 'Round List',
      createButton: 'Create Round',
      noRounds: 'No rounds available.',
      loading: 'Loading rounds...',
      status: {
        active: 'Active',
        cooldown: 'Cooldown',
        finished: 'Finished'
      }
    },
    round: {
      myPoints: 'My Points',
      tapButton: 'TAP ME!',
      backToList: 'Back to rounds',
      winner: 'Winner',
      total: 'Total'
    },
    errors: {
      loginFailed: 'Login failed. Please check your username and password.',
      networkError: 'Network error. Please check connection and try again.'
    }
  }
} as const;