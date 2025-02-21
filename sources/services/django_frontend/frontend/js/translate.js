const translations = {
    en: {
        about_us: "About Us",
        about_us_description: "This project has been realised by three students from 42 School.",
        settings: "Settings",
        win_condition: "Win condition",
        win_condition_description: "Number of points required to win the match.",
        opponent: "Opponent",
        opponent_description: "The opponent you want to play against.",
        sign_in: "Sign in",
        sign_in_with: "Sign in with ",
        ai_difficulty: "AI difficulty",
        ai_difficulty_description: "More soon... Stay tuned!",
        launch_game: "Launch game",
        tournament: "Tournament",
        tournament_name: "Tournament name",
        select_game: "Select game",
        number_of_players: "Number of players",
        players: "Players",
        create_tournament: "Create tournament",
        friends: "Friends",
        category: "Category",
        max_consecutive_goals: "Max consecutive goals",
        average_time_to_score: "Average time to score",
        fastest_time_to_score: "Fastest time to score",
        longest_bounce_streak: "Longest bounce streak",
        max_consecutive_wins: "Max consecutive wins",
        wins_as_crosses: "Wins as crosses",
        wins_as_noughts: "Wins as noughts",
        quickest_win_as_moves: "Quickest win as moves",
        player: "Player",
        rank: "Rank",
        welcome_message: "Welcome to our final 42 common core project!",
        waiting_to_start: "Waiting to start...",
        start_the_match: "Start the match",
        games: "Games",
        tournaments: "Tournaments",
        edit_profile_informations: "Edit profile informations",
        dont_have_an_account: "Don't have an account?",
        submit: "Submit",
        sign_up: "Sign up",
        already_have_an_account: "Already have an account ?",
        rankings: "Rankings",
        player_1: "Player 1",
        player_2: "Player 2",
        // placeholders
        username: "Username",
        display_name: "Display name",
        email: "Email",
        password: "Password",
        confirm_password: "Confirm password",
    },
    fr: {
        about_us: "À propos de nous",
        about_us_description: "Ce projet a été réalisé par trois étudiants de l'école 42.",
        settings: "Paramètres",
        win_condition: "Condition de victoire",
        win_condition_description: "Nombre de points requis pour gagner le match.",
        opponent: "Adversaire",
        opponent_description: "L'adversaire contre lequel vous voulez jouer.",
        sign_in: "Se connecter",
        sign_in_with: "Se connecter avec ",
        ai_difficulty: "Difficulté de l'IA",
        ai_difficulty_description: "Bientôt plus à venir... Restez à l'écoute !",
        launch_game: "Lancer le jeu",
        tournament: "Tournoi",
        tournament_name: "Nom du tournoi",
        select_game: "Choisir le jeu",
        number_of_players: "Nombre de joueurs",
        players: "Joueurs",
        create_tournament: "Créer un tournoi",
        friends: "Amis",
        category: "Catégorie",
        max_consecutive_goals: "Nombre maximum de buts consécutifs",
        average_time_to_score: "Temps moyen pour marquer",
        fastest_time_to_score: "Temps le plus rapide pour marquer",
        longest_bounce_streak: "Plus longue série de rebonds",
        max_consecutive_wins: "Nombre maximum de victoires consécutives",
        wins_as_crosses: "Victoires en tant que croix",
        wins_as_noughts: "Victoires en tant que ronds",
        quickest_win_as_moves: "Victoire la plus rapide en nombre de mouvements",
        player: "Joueur",
        rank: "Rang",
        welcome_message: "Bienvenue dans notre projet commun final de l'école 42 !",
        waiting_to_start: "En attente de démarrage...",
        start_the_match: "Démarrer la partie",
        games: "Jeux",
        tournaments: "Tournois",
        edit_profile_informations: "Modifier les informations du profil",
        dont_have_an_account: "Vous n'avez pas de compte ?",
        submit: "Soumettre",
        sign_up: "S'inscrire",
        already_have_an_account: "Vous avez déjà un compte ?",
        rankings: "Classements",
        player_1: "Joueur 1",
        player_2: "Joueur 2",
        // placeholders
        username: "Nom d'utilisateur",
        display_name: "Nom d'affichage",
        email: "Email",
        password: "Mot de passe",
        confirm_password: "Confirmer le mot de passe",
        // games messages
    },
};

function translate_page(language) {
    const elements = document.querySelectorAll('[data-translate]');
    
    elements.forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[language] && translations[language][key]) {
            element.textContent = translations[language][key];
        }
    });

    const placeholderElements = document.querySelectorAll('[data-translate-placeholder]');
    placeholderElements.forEach(element => {
        const key = element.getAttribute('data-translate-placeholder');
        if (translations[language] && translations[language][key]) {
            element.setAttribute('placeholder', translations[language][key]);
        }
    });

    localStorage.setItem('preferred-language', language);
}

function str_player_scores(player)
{
    let language = localStorage.getItem('preferred-language');
    if (language == 'fr')
        return player + " marque un point !";
    else if (language == 'de')
        return player + " erzielt einen Punkt !";
    else
        return player + " scores!";
}

function str_player_wins(winner)
{
    let language = localStorage.getItem('preferred-language');
    if (language == 'fr')
        return winner + " gagne la partie !";
    else if (language == 'de')
        return winner + " gewinnt das Spiel !";
    else
        return winner + " wins the match !";
}

function str_draw()
{
    let language = localStorage.getItem('preferred-language');
    if (language == 'fr')
        return "Égalité !";
    else if (language == 'de')
        return "Unentschieden !";
    else
        return "It's a draw !";
}

function str_button_replay()
{
    let language = localStorage.getItem('preferred-language');
    if (language == 'fr')
        return "Rejouer";
    else if (language == 'de')
        return "Nochmal spielen";
    else
        return "Replay";
}
