import { useEffect } from 'react';
import { VscGithubInverted } from 'react-icons/vsc';
import { api } from '../../services/api';
import styles from './styles.module.scss';

type AuthResponse = {
    token: string;
    user: {
        id: string;
        avatar_url: string;
        name: string;
        login: string;
    }
}

export function LoginBox() {
    const singInUrl = `https://github.com/login/oauth/authorize?scope=user&client_id=ba3f5fe6295e715afc6a`;

    async function signIn(githubCode: string) {
        const response = await api.post<AuthResponse>('authenticate', {
            code: githubCode,
        });

        const { token, user } = response.data;
        localStorage.setItem('@dowhile:token', token); //armazenando o token para que mesmo após fechar o navegador ele ainda tenha esse token salvo
        console.log(user);
    }


    useEffect(() => {
        const url = window.location.href;
        const hasGithubCode = url.includes('?code=');
        if (hasGithubCode) {
            const [urlWithoutCode, githubCode] = url.split('?code=');

            window.history.pushState({}, '', urlWithoutCode) //remove o codigo do github da url

            signIn(githubCode);
        }
    }, [])

    return (
        <div className={styles.loginBoxWrapper}>
            <strong>Entre e compartilhe sua menssagem</strong>
            <a href={singInUrl} className={styles.singInWithGithub}>
                <VscGithubInverted size="24" />
                Entrar com Github
            </a>
        </div>
    )
}