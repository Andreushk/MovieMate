# MovieMate
A service that provides the opportunity to get information about movies and TV series. Uses IMDB API and OMDB API. It is made for educational purposes.


Хочу уточнить, что IMDb API имеет ограничение в 100 запросов в сутки, поэтому, я подготовил запасные варианты ответов сервера на всякий случай. Они лежат в папке responses, а, файлы, к которым их можно подключить, в самом своём начале имеют import этих объектов ответа и краткий комментарий где и что нужно закомментировать и расскоментировать. Изначально всё работает на запросах, уже сохраненные объекты ответов не при делах. Еще, как вариант, можно поменять ключи для запросов - они лежат в объектах настроек модели в модулях, где используются сетевые запросы. Их достаточно поменять там и все запросы будут делаться с новым клюом :)
