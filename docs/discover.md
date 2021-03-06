#Поиск скрытых объектов#

##Параметры и характеристики персонажа, влияющие на поиск##

1. Параметр (parameter): мудрость (wisdom), 3 - 20 
2. Пассивное умение (ability): наблюдательность (observation), 0 - 3
3. Активное умение (skill): поиск (search), 0 - 3

Для изучения способностей нужна определенная мудрость.

Наблюдательность | Мудрость
:---------------:|:--------:
1                |10
2                |15
3                |18

Поиск            | Мудрость
:---------------:|:--------:
1                |8
2                |12
3                |15

При попытке найти скрытый объект высчитывается параметр discover:

    discover = wisdom * 2 + observation * 10;

В случае активного поиска, прибавляется бонус навыка поиска:

    discover = wisdom * 2 + observation * 10 + search * 10;

Таким образом, discover может быть в диапозоне от 6 (минимальная мудрость) до 96 (максимальная мудрость и все навыки).

Также discover может получить случайный бонус, размер которого определяется вероятностью: чем больше бонус, тем меньше вероятность его появления.

discoverBonus    | Вероятность
:---------------:|:------------:
20               | 1/1000
10               | 1/100
5                | 1/10


##Параметры сложности поиска для скрытых объектов##

У каждого скрытого объекта есть параметр hiddenPower (1 - 100). Он рассчитывается случайным образом в зависимости от сложности игры.

    hiddenPower = 1 + difficult * 10 + ~~(Math.random() * 100);

Также есть несколько ограничений.

1. На легкой сложности заведомо можно открыть все скрытые объекты, то есть maxHiddenPower < discover
2. На нормальной и сложной сложности заведомо можно найти все двери, ведущие на следующий уровень.
3. На хардкорной сложности все ограничения отсутствуют.

##Результат поиска##

Если discover >= hiddenPower, объект будет обнаружен.
