/* Pilk — languages. P.t(): UI strings; P.plural(); P.X: catalogue texts for ET and RU. English is the source.
   Page text lives in src/i18n/<lang>.json and is applied at build time. */
(function () {
  var P = window.PILK = window.PILK || {};
  var L = ((document.documentElement && document.documentElement.lang) || 'en').slice(0, 2);
  P.lang = L;
  P.t = function (s, o) { var r = (P.T[L] && P.T[L][s]) || s; if (o) for (var k in o) r = r.split('{' + k + '}').join(o[k]); return r; };
  var PL = { en: { set: ['set', 'sets'], size: ['size', 'sizes'] }, et: { set: ['komplekt', 'komplekti'], size: ['suurus', 'suurust'] }, ru: { set: ['набор', 'набора', 'наборов'], size: ['размер', 'размера', 'размеров'] } };
  P.plural = function (n, w) {
    var f = (PL[L] || PL.en)[w] || PL.en[w], i;
    if (L === 'ru') { var a = n % 10, b = n % 100; i = a === 1 && b !== 11 ? 0 : a >= 2 && a <= 4 && (b < 12 || b > 14) ? 1 : 2; } else i = n === 1 ? 0 : 1;
    return n + ' ' + f[i];
  };

  P.T = {
    et: {
      '{pack} added': '{pack} lisatud', 'View cart': 'Vaata ostukorvi', 'Full motion': 'Täielik liikumine', 'Reduce motion': 'Vähenda liikumist',
      'Please tick this box.': 'Palun märgi see kast.', 'Please fill this in.': 'Palun täida see väli.', 'This email looks short of a letter. Check it, please.': 'Sellest e-postist näib puuduvat täht. Palun kontrolli.',
      'Banner': 'Bänner', 'Story': 'Story', '6 × 3 m': '6 × 3 m', 'mm': 'mm', 'h': 'h', 'KB': 'KB', 'min': 'min',
      'The size advertisers buy most. Two lines of headline, the button where the eye ends.': 'Enim ostetud suurus. Kaks rida pealkirja, nupp seal, kuhu pilk lõpuks jõuab.',
      'Everything on one line. The second line steps out, the button stays big enough to hit.': 'Kõik ühel real. Teine rida jääb ära, nupp jääb piisavalt suureks, et sellele vajutada.',
      'Letters narrow to keep their height. Logo on top, action at the bottom.': 'Tähed kitsenevad, et kõrgus säiliks. Logo üleval, tegevus all.',
      'Feed size. The shape gets room, the words sit low where thumbs stop.': 'Voo suurus. Kujund saab ruumi, sõnad on all, kus pöial peatub.',
      'Words stay out of the top 13% and bottom 19%. That is where the app puts its buttons.': 'Sõnad püsivad ülemisest 13%-st ja alumisest 19%-st eemal. Seal on rakenduse nupud.',
      'Read at driving speed: four words, letters about 40 cm tall.': 'Loetakse sõidu pealt: neli sõna, tähed umbes 40 cm kõrged.',
      'Show {name}, {size}': 'Näita: {name}, {size}', 'Coats −30%': 'Mantlid −30%', 'Until Sunday': 'Pühapäevani', 'Shop coats': 'Vaata mantleid', 'Shoes −20%': 'Jalanõud −20%', 'Bags −50%': 'Kotid −50%',
      'Round {n} of 2': 'Voor {n}/2', 'Keep your eyes on the frame.': 'Hoia pilk raamil.', 'What was on sale, and how much?': 'Mis oli soodushinnaga ja kui palju?', 'Noted. Now the same offer, designed by us.': 'Kirjas. Nüüd sama pakkumine meie kujunduses.',
      'you picked “{opt}”.': 'valisid „{opt}“.', 'Right.': 'Õige.', 'Half a second is short. That is the point.': 'Pool sekundit on lühike. Selles ongi asi.', 'The loudest number won, not the offer.': 'Võitis kõige valjem number, mitte pakkumine.',
      'Result': 'Tulemus', 'The offer was <b>{offer}</b> both times.': 'Pakkumine oli mõlemal korral <b>{offer}</b>.', 'Busy banner': 'Kirju bänner', 'Our banner': 'Meie bänner', 'Try again': 'Proovi uuesti',
      'All': 'Kõik', 'our edit': 'meie täitmine', 'Print sizes are shown to scale': 'Trükisuurused on näidatud mõõtkavas', '26 sizes · from {price}': '26 suurust · alates {price}',
      'Logo': 'Logo', 'Your headline here': 'Sinu pealkiri siia', 'A second line': 'Teine rida', 'Button': 'Nupp', '404 × 404 of nothing.': '404 × 404 tühjust.', 'But the eye is still here': 'Aga silm on ikka siin', 'Go home': 'Avalehele',
      'Subtotal': 'Vahesumma', 'Code {code}': 'Kood {code}', 'VAT 24%, included': 'Käibemaks 24%, hinnas', 'Total': 'Kokku', 'Checkout': 'Vormistamine', 'Order': 'Tellimus', 'Cart': 'Ostukorv', 'Your cart': 'Sinu ostukorv', 'Your cart is empty': 'Ostukorv on tühi',
      'Every set comes in all its sizes. Pick a design, add your words, and it’s ready.': 'Iga komplekt tuleb kõigis oma suurustes. Vali kujundus, lisa oma sõnad ja ongi valmis.',
      'Browse sets': 'Vaata komplekte', '{name}, open the set': '{name}, ava komplekt', '{pack}, {n} sizes': '{pack}, {n} suurust', 'Remove': 'Eemalda',
      'Code applied: 10% off.': 'Kood rakendatud: −10%.', 'This code doesn’t work. Check the spelling, please.': 'See kood ei kehti. Palun kontrolli kirjapilti.', 'Type a code first.': 'Kirjuta esmalt kood.',
      'Order {no} received.': 'Tellimus {no} vastu võetud.', 'Thank you. The invoice and download links go to {email}.': 'Aitäh. Arve ja allalaadimislingid lähevad aadressile {email}.',
      '3, free': '3, tasuta', 'Free': 'Tasuta', 'Three sizes back within 24 working hours.': 'Kolm suurust tagasi 24 tööajatunni jooksul.', 'We’ll suggest': 'Pakume välja',
      'Tell us the goal; we reply with options and prices.': 'Kirjelda eesmärki, vastame valikute ja hindadega.', 'An estimate appears as you answer.': 'Hinnang ilmub vastamise ajal.',
      'First sketch by {date}. The final price is fixed in our reply.': 'Esimene eskiis hiljemalt {date}. Lõplik hind on kirjas meie vastuses.', 'Always-on is monthly.': 'Püsiteenus on kuupõhine.',
      'Choose files, or drop them here': 'Vali failid või lohista need siia', 'Tight. We’ll tell you honestly in our reply whether we can make it.': 'Tihe. Ütleme vastuses ausalt, kas jõuame.', 'Fine. The first sketch would arrive by {date}.': 'Sobib. Esimene eskiis jõuaks sinuni hiljemalt {date}.',
      'Step {n} of {N}': 'Samm {n}/{N}', 'Send the brief': 'Saada lähteülesanne', 'Next': 'Edasi', 'Your banner': 'Sinu bänner', '(needed for the test)': '(proovitööks vajalik)', 'Logo, photos or your current banner': 'Logo, fotod või praegune bänner', '(optional)': '(valikuline)',
      'Brief {no} received.': 'Lähteülesanne {no} kätte saadud.', 'Thank you, {name}.': 'Aitäh, {name}.', 'Your three free sizes are on their way.': 'Sinu kolm tasuta suurust on teel.', 'We reply to {email} within two working hours.': 'Vastame aadressile {email} kahe tööajatunni jooksul.',
      '{name} set, preview': '{name}, eelvaade', 'New': 'Uus', 'Add {name}, display pack, to cart': 'Lisa {name} (veebipakk) ostukorvi', 'Add': 'Lisa', 'All 26: {price}': 'Kõik 26: {price}',
      'This design is static only.': 'See kujundus on ainult staatiline.', '{name} banner set': 'Bännerikomplekt {name}', 'Preview it in every size with your own words.': 'Vaata seda igas suuruses oma sõnadega.',
      'Shop': 'Pood', 'Services': 'Teenused', 'Size guide': 'Suuruste juhend', 'Contact': 'Kontakt', 'Brief': 'Lähteülesanne', 'Home': 'Avaleht', 'Websites': 'Veebilehed', 'What should the site have?': 'Mis veebilehel olema peaks?', 'Tick what fits. Nothing here is final.': 'Märgi, mis sobib. Siin pole miski lõplik.', 'Tell us about the business': 'Räägi oma ettevõttest', 'What you do': 'Millega tegeled', 'e.g. Café in Kalamaja: lunch and catering': 'nt Kohvik Kalamajas: lõunad ja catering', 'Café': 'Kohvik', 'Beauty salon': 'Ilusalong', 'Bike workshop': 'Rattatöökoda', 'Concert': 'Kontsert', 'Spa hotel': 'Spaahotell', 'Course': 'Kursus', 'My own idea': 'Minu oma idee',
      'Where it runs': 'Kus ilmub', 'Size': 'Suurus', 'Aspect ratio': 'Kuvasuhe', 'Files': 'Failid', 'In our packs': 'Meie pakkides', 'from {price}': 'alates {price}', 'Get this size free': 'Saa see suurus tasuta', 'How we lay it out': 'Kuidas me selle paigutame', 'Files you get': 'Failid, mille saad', 'Other sizes in the {pack}': 'Teised suurused: {pack}', 'All 26 sizes': 'Kõik 26 suurust', '{name} banner size {size}: where it runs and the rule': '{name}, bänneri suurus {size}: kus ilmub ja mis reegel loeb', 'It didn’t send. Please write to {email}.': 'Saatmine ebaõnnestus. Palun kirjuta aadressile {email}.', 'Everything sits on one line: logo, headline, button. The second line is dropped, and the button stays big enough to hit.': 'Kõik on ühel real: logo, pealkiri, nupp. Teine rida jääb ära ja nupp jääb piisavalt suureks, et sellele vajutada.', 'The headline takes the left in up to two lines, the button stands on the right, and the shape closes the edge.': 'Pealkiri on vasakul kuni kahel real, nupp paremal ja kujund lõpetab serva.', 'Words on the left, the shape on the right, the button right under the headline.': 'Sõnad vasakul, kujund paremal, nupp kohe pealkirja all.', 'The shape gets the top, the headline sits below in two lines, the button comes last.': 'Kujund on üleval, pealkiri selle all kahel real, nupp viimasena.', 'Tall art on top, words stacked under it, the button at the bottom where the thumb rests.': 'Kõrge pilt üleval, sõnad selle all, nupp all, kus pöial puhkab.', 'Narrow letters keep their height, words are stacked one under another, logo on top and button at the bottom.': 'Kitsad tähed hoiavad kõrgust, sõnad on üksteise all, logo üleval ja nupp all.', 'Google Ads accepts uploaded images up to 150 KB and HTML5 banners up to 600 KB. We keep every file under those limits and name it for upload.': 'Google Ads võtab vastu kuni 150 KB pilte ja kuni 600 KB HTML5-bännereid. Hoiame iga faili nendest piiridest allpool ja nimetame selle üleslaadimiseks.', 'You get PNG and JPG, kept light. The platform puts its own buttons and captions around the picture, so the words stay away from the edges.': 'Saad kerged PNG- ja JPG-failid. Platvorm lisab pildi ümber oma nupud ja tekstid, seepärast hoiame sõnad servadest eemal.', 'You get a vector PDF in CMYK with 3 mm bleed, the extra edge that trimming needs. Very large formats are made at 1:10 scale, which print shops accept.': 'Saad CMYK-värvides vektor-PDF-i 3 mm lõikevaruga ehk lisaservaga, mida lõikamine vajab. Väga suured formaadid tehakse mõõtkavas 1:10, mida trükikojad vastu võtavad.'
    },
    ru: {
      '{pack} added': '{pack}: добавлено', 'View cart': 'В корзину', 'Full motion': 'Полная анимация', 'Reduce motion': 'Меньше анимации',
      'Please tick this box.': 'Пожалуйста, отметьте этот пункт.', 'Please fill this in.': 'Пожалуйста, заполните это поле.', 'This email looks short of a letter. Check it, please.': 'Кажется, в адресе не хватает буквы. Проверьте, пожалуйста.',
      'Banner': 'Баннер', 'Story': 'Сторис', '6 × 3 m': '6 × 3 м', 'mm': 'мм', 'h': 'ч', 'KB': 'КБ', 'min': 'мин',
      'The size advertisers buy most. Two lines of headline, the button where the eye ends.': 'Самый покупаемый размер. Две строки заголовка, кнопка там, где заканчивается взгляд.',
      'Everything on one line. The second line steps out, the button stays big enough to hit.': 'Всё в одну строку. Вторая строка уходит, кнопка остаётся достаточно крупной, чтобы в неё попасть.',
      'Letters narrow to keep their height. Logo on top, action at the bottom.': 'Буквы сужаются, чтобы сохранить высоту. Логотип сверху, действие внизу.',
      'Feed size. The shape gets room, the words sit low where thumbs stop.': 'Размер для ленты. Форме — простор, слова внизу, где останавливается палец.',
      'Words stay out of the top 13% and bottom 19%. That is where the app puts its buttons.': 'Слова не заходят в верхние 13% и нижние 19%. Там приложение ставит свои кнопки.',
      'Read at driving speed: four words, letters about 40 cm tall.': 'Читается на скорости: четыре слова, буквы высотой около 40 см.',
      'Show {name}, {size}': 'Показать: {name}, {size}', 'Coats −30%': 'Пальто −30%', 'Until Sunday': 'До воскресенья', 'Shop coats': 'Купить пальто', 'Shoes −20%': 'Обувь −20%', 'Bags −50%': 'Сумки −50%',
      'Round {n} of 2': 'Раунд {n} из 2', 'Keep your eyes on the frame.': 'Смотрите в рамку.', 'What was on sale, and how much?': 'Что было со скидкой и сколько?', 'Noted. Now the same offer, designed by us.': 'Записали. Теперь то же предложение в нашем дизайне.',
      'you picked “{opt}”.': 'вы выбрали «{opt}».', 'Right.': 'Верно.', 'Half a second is short. That is the point.': 'Полсекунды — это мало. В этом и смысл.', 'The loudest number won, not the offer.': 'Победила самая громкая цифра, а не предложение.',
      'Result': 'Результат', 'The offer was <b>{offer}</b> both times.': 'Оба раза предложение было одно: <b>{offer}</b>.', 'Busy banner': 'Перегруженный баннер', 'Our banner': 'Наш баннер', 'Try again': 'Ещё раз',
      'All': 'Все', 'our edit': 'наше заполнение', 'Print sizes are shown to scale': 'Печатные размеры показаны в масштабе', '26 sizes · from {price}': '26 размеров · от {price}',
      'Logo': 'Логотип', 'Your headline here': 'Ваш заголовок здесь', 'A second line': 'Вторая строка', 'Button': 'Кнопка', '404 × 404 of nothing.': '404 × 404 пустоты.', 'But the eye is still here': 'Но глаз всё ещё здесь', 'Go home': 'На главную',
      'Subtotal': 'Сумма', 'Code {code}': 'Код {code}', 'VAT 24%, included': 'НДС 24% включён', 'Total': 'Итого', 'Checkout': 'Оформление', 'Order': 'Заказ', 'Cart': 'Корзина', 'Your cart': 'Ваша корзина', 'Your cart is empty': 'Корзина пуста',
      'Every set comes in all its sizes. Pick a design, add your words, and it’s ready.': 'Каждый набор идёт во всех своих размерах. Выберите дизайн, добавьте слова — и готово.',
      'Browse sets': 'Смотреть наборы', '{name}, open the set': '{name}: открыть набор', '{pack}, {n} sizes': '{pack}, {n} размеров', 'Remove': 'Удалить',
      'Code applied: 10% off.': 'Код применён: −10%.', 'This code doesn’t work. Check the spelling, please.': 'Этот код не работает. Проверьте написание.', 'Type a code first.': 'Сначала введите код.',
      'Order {no} received.': 'Заказ {no} получен.', 'Thank you. The invoice and download links go to {email}.': 'Спасибо. Счёт и ссылки на скачивание придут на {email}.',
      '3, free': '3, бесплатно', 'Free': 'Бесплатно', 'Three sizes back within 24 working hours.': 'Три размера за 24 рабочих часа.', 'We’ll suggest': 'Подскажем',
      'Tell us the goal; we reply with options and prices.': 'Опишите цель — ответим вариантами и ценами.', 'An estimate appears as you answer.': 'Оценка появится по ходу ответов.',
      'First sketch by {date}. The final price is fixed in our reply.': 'Первый эскиз — к {date}. Итоговую цену зафиксируем в ответе.', 'Always-on is monthly.': 'Абонемент — ежемесячный.',
      'Choose files, or drop them here': 'Выберите файлы или перетащите их сюда', 'Tight. We’ll tell you honestly in our reply whether we can make it.': 'Сжато. В ответе честно скажем, успеваем ли.', 'Fine. The first sketch would arrive by {date}.': 'Успеваем. Первый эскиз будет к {date}.',
      'Step {n} of {N}': 'Шаг {n} из {N}', 'Send the brief': 'Отправить бриф', 'Next': 'Далее', 'Your banner': 'Ваш баннер', '(needed for the test)': '(нужен для теста)', 'Logo, photos or your current banner': 'Логотип, фото или ваш текущий баннер', '(optional)': '(необязательно)',
      'Brief {no} received.': 'Бриф {no} получен.', 'Thank you, {name}.': 'Спасибо, {name}.', 'Your three free sizes are on their way.': 'Ваши три бесплатных размера уже в работе.', 'We reply to {email} within two working hours.': 'Ответим на {email} в течение двух рабочих часов.',
      '{name} set, preview': '{name}: превью набора', 'New': 'Новинка', 'Add {name}, display pack, to cart': 'Добавить {name} (пакет для веба) в корзину', 'Add': 'Добавить', 'All 26: {price}': 'Все 26: {price}',
      'This design is static only.': 'Этот дизайн только статичный.', '{name} banner set': 'Набор баннеров {name}', 'Preview it in every size with your own words.': 'Посмотрите его во всех размерах со своими словами.',
      'Shop': 'Магазин', 'Services': 'Услуги', 'Size guide': 'Гид по размерам', 'Contact': 'Контакты', 'Brief': 'Бриф', 'Home': 'Главная', 'Websites': 'Сайты', 'What should the site have?': 'Что должно быть на сайте?', 'Tick what fits. Nothing here is final.': 'Отметьте подходящее. Здесь ничего не окончательно.', 'Tell us about the business': 'Расскажите о бизнесе', 'What you do': 'Чем вы занимаетесь', 'e.g. Café in Kalamaja: lunch and catering': 'например, Кафе в Каламая: обеды и кейтеринг', 'Café': 'Кафе', 'Beauty salon': 'Салон красоты', 'Bike workshop': 'Веломастерская', 'Concert': 'Концерт', 'Spa hotel': 'Спа-отель', 'Course': 'Курс', 'My own idea': 'Своя идея',
      'Where it runs': 'Где показывается', 'Size': 'Размер', 'Aspect ratio': 'Соотношение сторон', 'Files': 'Файлы', 'In our packs': 'В наших пакетах', 'from {price}': 'от {price}', 'Get this size free': 'Получить этот размер бесплатно', 'How we lay it out': 'Как мы его компонуем', 'Files you get': 'Какие файлы вы получите', 'Other sizes in the {pack}': 'Другие размеры: {pack}', 'All 26 sizes': 'Все 26 размеров', '{name} banner size {size}: where it runs and the rule': '{name}, размер баннера {size}: где показывается и главное правило', 'It didn’t send. Please write to {email}.': 'Не отправилось. Напишите, пожалуйста, на {email}.', 'Everything sits on one line: logo, headline, button. The second line is dropped, and the button stays big enough to hit.': 'Всё стоит в одну строку: логотип, заголовок, кнопка. Вторая строка уходит, а кнопка остаётся достаточно крупной, чтобы в неё попасть.', 'The headline takes the left in up to two lines, the button stands on the right, and the shape closes the edge.': 'Заголовок занимает левую часть максимум в две строки, кнопка стоит справа, форма замыкает край.', 'Words on the left, the shape on the right, the button right under the headline.': 'Слова слева, форма справа, кнопка сразу под заголовком.', 'The shape gets the top, the headline sits below in two lines, the button comes last.': 'Форма занимает верх, заголовок в две строки под ней, кнопка в конце.', 'Tall art on top, words stacked under it, the button at the bottom where the thumb rests.': 'Высокая картинка сверху, слова под ней, кнопка внизу, где лежит большой палец.', 'Narrow letters keep their height, words are stacked one under another, logo on top and button at the bottom.': 'Узкие буквы сохраняют высоту, слова стоят столбиком, логотип сверху, кнопка внизу.', 'Google Ads accepts uploaded images up to 150 KB and HTML5 banners up to 600 KB. We keep every file under those limits and name it for upload.': 'Google Ads принимает картинки до 150 КБ и HTML5-баннеры до 600 КБ. Каждый файл мы укладываем в эти лимиты и подписываем для загрузки.', 'You get PNG and JPG, kept light. The platform puts its own buttons and captions around the picture, so the words stay away from the edges.': 'Вы получаете лёгкие PNG и JPG. Площадка ставит вокруг картинки свои кнопки и подписи, поэтому слова держим подальше от краёв.', 'You get a vector PDF in CMYK with 3 mm bleed, the extra edge that trimming needs. Very large formats are made at 1:10 scale, which print shops accept.': 'Вы получаете векторный PDF в CMYK с вылетами 3 мм — запасом, который нужен при резке. Очень большие форматы делаем в масштабе 1:10, типографии такой принимают.'
    }
  };

  /* catalogue: designs id: [head, sub, cta, about]; formats id: [name, where]; packs: [name, short, plain]; extras: [name, plain] */
  P.X = {
    et: {
      pilk: ['Ühe pilguga selge.', 'Bännerid igas suuruses', 'Telli'],
      designs: {
        'soft-sale': ['Talvine allahindlus −30%', 'Kuni 8. detsembrini', 'Osta kohe', 'Soe ja vaikne. Kõigepealt loetakse allahindlust, viimasena nuppu, vahepeal ei karju miski.'],
        'launch-day': ['Tutvu: Volt Mini', 'Taskulaadija · alates 39 €', 'Telli ette', 'Ööpimeda sinisega lava ühele uuele asjale. Tõusvad kaared viivad pilgu toote nimeni.'],
        'lunch-story': ['Supp + leib 7,90 €', 'Tööpäeviti 11–15', 'Vaata menüüd', 'Lõunatunni kollane ja ülevalt nähtud taldrik. Hind ongi pealkiri.'],
        'late-gallery': ['Reedeti avatud hiljani', 'Tasuta sissepääs 18–22', 'Planeeri külastus', 'Paberivalge, kolm kaart ja kerge groteskkiri. Kultuurile, mis tahab rahulikuks jääda.'],
        'fresh-hire': ['Otsime kullereid', 'Paindlik aeg · 14 € tunnis', 'Kandideeri', 'Mündiroheline ja sõbralik. Palk ja tunnid on kohe töö all, sest neid vaadatakse esimesena.'],
        'glow-serum': ['Sära seitsme päevaga', 'C-vitamiini seerum · 30 ml', 'Proovi', 'Õrn roosa ja üks pehmelt helendav tilk. Kerged tähed tootele, mis peab tunduma õrn.'],
        'big-number': ['−50% kõrvaklappidele', 'Black Friday · 28.11', 'Haara pakkumine', 'Sellele ühele nädalale aastas, kui number peab võitma. Rasked tähed, plahvatus, ei midagi üleliigset.'],
        'calm-finance': ['Säästa mõtlemata', 'Ümardused alates 1 € päevas', 'Lae äpp alla', 'Taevasinine ja ülespoole tõusev joon. Usaldus tuleb rahust, mitte suurematest lubadustest.'],
        'sea-sound': ['Live mere ääres', '12.–14. juuni · Tallinn', 'Osta pilet', 'Sügav mereroheline, virsikukarva kiri ja helilained, mis animeeritud versioonis liiguvad.'],
        'open-house': ['Avatud uksed pühapäeval', '2-toalised korterid alates 129 000 €', 'Broneeri aeg', 'Liiva- ja savitoonid ning rida katuseid. Kõigepealt kuupäev, siis hind, lõpuks broneerimine.'],
        'summer-camp': ['Suvelaager on tagasi', '7–12-aastastele · Pärnu', 'Registreeru', 'Taevas täis konfetti. Vanemad näevad kohe vanusevahemikku, lapsed lõbu.'],
        'bike-season': ['Rattahooaeg on avatud', 'Täishooldus alates 25 €', 'Broneeri hooldus', 'Kevadine laimiroheline ja kaks pöörlevat ratast. Piisavalt vali tänavale, piisavalt lihtne telefonile.'],
        'clear-webinar': ['Tasuta veebiseminar: e-müük', 'N 4. dets · 14.00', 'Võta koht', 'Valge, sinine ja üks kollane ruut. Kuupäev ja kellaaeg jäävad loetavaks isegi 320 × 50 juures.'],
        'coffee-club': ['Iga 6. kohv on tasuta', 'Liitu klubiga äpis', 'Liitu', 'Latte toonid ja tassi rõngad. Püsikliendi pakkumine, mis seletab end ühe reaga.'],
        'wool-edit': ['Villane valik', 'Uus · 24 eset', 'Vaata valikut', 'Ajakirjalik ja vaikne: kerged suurtähed, kudumilaadsed triibud, palju õhku.'],
        'spa-weekend': ['Kaks ööd, üks vaikne arve', 'Nädalavahetus kahele alates 249 €', 'Broneeri', 'Salveiroheline ja aeglased lainetused. Hind kahele vastab esimesele küsimusele.'],
        'grand-opening': ['Avame laupäeval', 'Kingitus esimesele 100 külalisele', 'Leia meid', 'Korall ja õhupallid. Päev on pealkiri, kingitus on põhjus varakult tulla.'],
        'ux-course': ['Õpi UX-i 12 nädalaga', 'Uus grupp alustab 12. jaanuaril', 'Kandideeri', 'Sügav sinakasroheline ja ülespoole viivad astmed. Kursustele ja töökohtadele, kus järgmine samm ongi sõnum.']
      },
      formats: {
        '300x250': ['Keskmine ristkülik', 'Google Display'], '336x280': ['Suur ristkülik', 'Google Display'], '728x90': ['Leaderboard', 'Veebilehed arvutis'], '300x600': ['Poolleht', 'Veebilehed arvutis'],
        '160x600': ['Lai pilvelõhkuja', 'Veebilehed arvutis'], '320x50': ['Mobiili leaderboard', 'Telefonid'], '320x100': ['Suur mobiilibänner', 'Telefonid'], '970x250': ['Billboard', 'Lehe päised'],
        '970x90': ['Suur leaderboard', 'Veebilehed arvutis'], '468x60': ['Bänner', 'Vanemad pinnad'], '250x250': ['Ruut', 'Google Display'], '200x200': ['Väike ruut', 'Google Display'],
        '1080x1080': ['Ruutpostitus', 'Instagram, Facebook'], '1080x1350': ['Püstpostitus', 'Instagram, Facebook'], '1080x1920': ['Story / Reel', 'Instagram, TikTok'], '1200x628': ['Lingireklaam', 'Facebook, LinkedIn'],
        '1584x396': ['Lehe kaanepilt', 'LinkedIn'], '1500x500': ['Päis', 'X (Twitter)'], '1280x720': ['Pisipilt', 'YouTube'], '1000x1500': ['Pin', 'Pinterest'],
        'rollup': ['Roll-up', 'Messid, fuajeed'], 'billboard': ['Suurplakat', 'Tänavad, maanteed'], 'citylight': ['Citylight', 'Bussipeatused'], 'mesh': ['Võrkbänner', 'Aiad, fassaadid'], 'a1': ['Plakat A1', 'Poeaknad'], 'a5': ['Flaier A5', 'Letid, post']
      },
      packs: { display: ['Veebipakk', 'Veeb', 'Google Ads ja veebilehtede bännerid'], social: ['Sotsiaalmeedia pakk', 'Sotsiaalmeedia', 'Postitused, story’d, kaanepildid ja lingireklaamid'], print: ['Trükipakk', 'Trükk', 'Roll-up, suurplakat, citylight, plakatid'], all: ['Kõik suurused', 'Kõik', 'Kõik 26 suurust ühest kujundusest'] },
      extras: { anim: ['Animeeritud HTML5', 'Liigub pehmelt ja jääb alla 600 KB, mis on Google Adsi HTML5 piir.'], edit: ['Täidame sinu tekstiga', 'Saada sõnad ja saad valmis failid 24 tööajatunni jooksul.'] },
      cats: { sale: 'Allahindlus', food: 'Söök ja jook', launch: 'Lansseering', event: 'Üritus', beauty: 'Ilu', tech: 'Tehnoloogia', hiring: 'Värbamine ja õpe', estate: 'Kinnisvara' },
      styles: { bold: 'Julge', soft: 'Pehme', calm: 'Rahulik' },
      files: { d: '150 KB pilt · 600 KB HTML5', s: 'PNG või JPG, kerge', p: 'Vektor-PDF, CMYK, lõikevaru', p10: 'Vektor-PDF, CMYK, lõikevaru, mõõtkavas 1:10' },
      rules: {
        '300x250': 'Enim ostetud suurus. Pealkiri kõige rohkem kahel real.', '336x280': 'Sama paigutus nagu 300 × 250, veidi rohkem õhku.', '728x90': 'Kõik ühele reale, teine rida jääb ära.',
        '300x600': 'Kõrge pilt üleval, sõnad all, nupp viimasena.', '160x600': 'Kitsad tähed hoiavad kõrgust. Laota sõnad üksteise alla.', '320x50': 'Kõige raskem suurus: neli-viis sõna, ühesõnaline nupp.',
        '320x100': 'Ruumi ühe rea jagu rohkem kui 320 × 50, mitte enam.', '970x250': 'Päise suurus: teine rida ja suur nupp mahuvad.', '970x90': 'Nagu 728 × 90, aga laiem. Logo võib jääda.',
        '468x60': 'Vanem suurus, ikka müügil. Hoia ühel real.', '250x250': 'Väike ruut: üks kujund, vähe sõnu.', '200x200': 'Kõige väiksem ruut. Ainult pealkiri ja nupp.',
        '1080x1080': 'Voo ruut: suur kujund, sõnad all.', '1080x1350': 'Võtab telefonis voos kõige rohkem kõrgust.', '1080x1920': 'Hoia sõnad umbes ülemisest 250 px-st ja alumisest 340 px-st eemal: seal on rakenduse nupud.',
        '1200x628': 'Lingipilt: platvorm lisab selle alla oma pealkirja.', '1584x396': 'Lehe logo katab alumise vasaku nurga. Hoia sõnad paremal.', '1500x500': 'Profiilipilt katab osa alumisest vasakust servast. Hoia sõnad keskelt paremal.',
        '1280x720': 'Video pikkus on all paremal. Hoia see nurk vaba.', '1000x1500': '2:3 on suhe, mida Pinterest soovitab.', 'rollup': 'Alumise 20 cm ees seisavad inimesed. Hoia sõnad sellest kõrgemal.',
        'billboard': 'Loetakse sõidu pealt: neli sõna, tähed umbes 40 cm kõrged.', 'citylight': 'Bussipeatustes tagant valgustatud. Tume tekst heledal taustal loeb kõige paremini.', 'mesh': 'Tuul käib aukudest läbi, peened jooned kaovad. Hoia kujundid jõulised.',
        'a1': 'Loetakse poeaknast kahe-kolme meetri kauguselt.', 'a5': '3 mm lõikevaru igal küljel, 5 mm turvaala sees.'
      }
    },
    ru: {
      pilk: ['Ясно с первого взгляда.', 'Баннеры в любом размере', 'Заказать'],
      designs: {
        'soft-sale': ['Зимняя распродажа −30%', 'До 8 декабря', 'Купить', 'Тёплый и спокойный. Сначала читается скидка, последней — кнопка, и ничто не кричит между ними.'],
        'launch-day': ['Встречайте Volt Mini', 'Карманная зарядка · от 39 €', 'Предзаказ', 'Ночная синяя сцена для одной новинки. Поднимающиеся дуги ведут взгляд к названию продукта.'],
        'lunch-story': ['Суп + хлеб 7,90 €', 'По будням 11–15', 'Смотреть меню', 'Обеденный жёлтый и тарелка сверху. Цена — это и есть заголовок.'],
        'late-gallery': ['По пятницам допоздна', 'Вход свободный 18–22', 'Спланировать визит', 'Бумажно-белый, три арки и лёгкий гротеск. Для культуры, которая хочет оставаться спокойной.'],
        'fresh-hire': ['Ищем курьеров', 'Гибкий график · 14 € в час', 'Откликнуться', 'Мятный и дружелюбный. Оплата и часы — прямо под вакансией, потому что их смотрят первыми.'],
        'glow-serum': ['Сияние за семь дней', 'Сыворотка с витамином C · 30 мл', 'Попробовать', 'Пудрово-розовый и одна мягко светящаяся капля. Лёгкие буквы для продукта, который должен казаться нежным.'],
        'big-number': ['−50% на наушники', 'Чёрная пятница · 28.11', 'Забрать скидку', 'Для той единственной недели в году, когда должна победить цифра. Тяжёлые буквы, взрыв и ничего лишнего.'],
        'calm-finance': ['Копите не думая', 'Округления от 1 € в день', 'Скачать приложение', 'Небесно-голубой и линия, идущая вверх. Доверие рождается из спокойствия, а не из громких обещаний.'],
        'sea-sound': ['Живая музыка у моря', '12–14 июня · Таллинн', 'Купить билеты', 'Глубокий морской зелёный, персиковый шрифт и звуковые волны, которые движутся в анимированной версии.'],
        'open-house': ['Открытый показ в воскресенье', 'Двухкомнатные квартиры от 129 000 €', 'Записаться', 'Песочные и глиняные тона и ряд крыш. Сначала дата, потом цена, в конце — запись.'],
        'summer-camp': ['Летний лагерь снова открыт', 'Возраст 7–12 · Пярну', 'Записаться', 'Небо в конфетти. Родители сразу видят возраст, дети — веселье.'],
        'bike-season': ['Велосезон открыт', 'Полное ТО от 25 €', 'Записаться на сервис', 'Весенний лайм и два крутящихся колеса. Достаточно громко для улицы, достаточно просто для телефона.'],
        'clear-webinar': ['Бесплатный вебинар: продажи онлайн', 'Чт 4 дек · 14:00', 'Занять место', 'Белый, синий и один жёлтый квадрат. Дата и время читаются даже в 320 × 50.'],
        'coffee-club': ['Каждый 6-й кофе бесплатно', 'Вступайте в клуб в приложении', 'Вступить', 'Тона латте и кольца от чашки. Программа лояльности, которая объясняет себя одной строкой.'],
        'wool-edit': ['Шерстяная подборка', 'Новинки · 24 вещи', 'Смотреть подборку', 'Журнальный и тихий: лёгкие прописные, полосы как вязка, много воздуха.'],
        'spa-weekend': ['Две ночи, один тихий счёт', 'Выходные на двоих от 249 €', 'Забронировать', 'Шалфейный зелёный и медленная рябь. Цена на двоих отвечает на первый вопрос.'],
        'grand-opening': ['Открываемся в субботу', 'Подарок первым 100 гостям', 'Как нас найти', 'Коралловый и воздушные шары. День — это заголовок, подарок — повод прийти пораньше.'],
        'ux-course': ['Освойте UX за 12 недель', 'Новая группа стартует 12 января', 'Подать заявку', 'Глубокий бирюзовый и ступени вверх. Для курсов и вакансий, где следующий шаг и есть сообщение.']
      },
      formats: {
        '300x250': ['Средний прямоугольник', 'Google Display'], '336x280': ['Большой прямоугольник', 'Google Display'], '728x90': ['Лидерборд', 'Сайты на компьютере'], '300x600': ['Полстраницы', 'Сайты на компьютере'],
        '160x600': ['Широкий небоскрёб', 'Сайты на компьютере'], '320x50': ['Мобильный лидерборд', 'Телефоны'], '320x100': ['Большой мобильный баннер', 'Телефоны'], '970x250': ['Билборд', 'Шапки сайтов'],
        '970x90': ['Большой лидерборд', 'Сайты на компьютере'], '468x60': ['Баннер', 'Старые площадки'], '250x250': ['Квадрат', 'Google Display'], '200x200': ['Малый квадрат', 'Google Display'],
        '1080x1080': ['Квадратный пост', 'Instagram, Facebook'], '1080x1350': ['Вертикальный пост', 'Instagram, Facebook'], '1080x1920': ['Сторис / Reels', 'Instagram, TikTok'], '1200x628': ['Реклама со ссылкой', 'Facebook, LinkedIn'],
        '1584x396': ['Обложка страницы', 'LinkedIn'], '1500x500': ['Шапка', 'X (Twitter)'], '1280x720': ['Обложка видео', 'YouTube'], '1000x1500': ['Пин', 'Pinterest'],
        'rollup': ['Ролл-ап', 'Выставки, холлы'], 'billboard': ['Билборд', 'Улицы, трассы'], 'citylight': ['Ситилайт', 'Остановки'], 'mesh': ['Баннерная сетка', 'Заборы, фасады'], 'a1': ['Плакат A1', 'Витрины'], 'a5': ['Флаер A5', 'Стойки, почта']
      },
      packs: { display: ['Пакет для веба', 'Веб', 'Баннеры для Google Ads и сайтов'], social: ['Пакет для соцсетей', 'Соцсети', 'Посты, сторис, обложки и реклама со ссылкой'], print: ['Пакет для печати', 'Печать', 'Ролл-ап, билборд, ситилайт, плакаты'], all: ['Все размеры', 'Все', 'Все 26 размеров из одного дизайна'] },
      extras: { anim: ['Анимированный HTML5', 'Мягко движется и весит меньше 600 КБ — это лимит Google Ads для HTML5.'], edit: ['Заполним вашим текстом', 'Пришлите слова — готовые файлы будут в течение 24 рабочих часов.'] },
      cats: { sale: 'Распродажа', food: 'Еда и напитки', launch: 'Запуск', event: 'Событие', beauty: 'Красота', tech: 'Технологии', hiring: 'Найм и учёба', estate: 'Недвижимость' },
      styles: { bold: 'Смелый', soft: 'Мягкий', calm: 'Спокойный' },
      files: { d: '150 КБ картинка · 600 КБ HTML5', s: 'PNG или JPG, лёгкий', p: 'Векторный PDF, CMYK, вылеты', p10: 'Векторный PDF, CMYK, вылеты, в масштабе 1:10' },
      rules: {
        '300x250': 'Самый покупаемый размер. Заголовок — максимум в две строки.', '336x280': 'Та же раскладка, что у 300 × 250, чуть больше воздуха.', '728x90': 'Всё в одну строку, вторая строка уходит.',
        '300x600': 'Высокая картинка сверху, слова под ней, кнопка последней.', '160x600': 'Узкие буквы сохраняют высоту. Слова — столбиком.', '320x50': 'Самый трудный размер: четыре-пять слов и кнопка в одно слово.',
        '320x100': 'На одну строку больше, чем у 320 × 50, и не более.', '970x250': 'Размер для шапки: помещаются вторая строка и большая кнопка.', '970x90': 'Как 728 × 90, только шире. Логотип можно оставить.',
        '468x60': 'Старый размер, но его всё ещё продают. Держите в одну строку.', '250x250': 'Маленький квадрат: одна форма, мало слов.', '200x200': 'Самый маленький квадрат. Только заголовок и кнопка.',
        '1080x1080': 'Квадрат для ленты: крупная форма, слова внизу.', '1080x1350': 'Занимает больше всего высоты в ленте на телефоне.', '1080x1920': 'Не ставьте слова примерно в верхние 250 px и нижние 340 px: там кнопки приложения.',
        '1200x628': 'Картинка ссылки: площадка сама добавляет под ней заголовок.', '1584x396': 'Логотип страницы закрывает нижний левый угол. Держите слова справа.', '1500x500': 'Фото профиля перекрывает низ слева. Держите слова правее центра.',
        '1280x720': 'Длительность видео стоит внизу справа. Оставьте этот угол свободным.', '1000x1500': '2:3 — соотношение, которое рекомендует Pinterest.', 'rollup': 'Перед нижними 20 см стоят люди. Держите слова выше.',
        'billboard': 'Читается на скорости: четыре слова, буквы высотой около 40 см.', 'citylight': 'Подсвечивается сзади на остановках. Тёмный текст на светлом читается лучше всего.', 'mesh': 'Ветер проходит через отверстия, тонкие линии пропадают. Делайте формы крупными.',
        'a1': 'Читается из витрины с двух-трёх метров.', 'a5': 'Вылеты 3 мм с каждой стороны и 5 мм безопасного поля внутри.'
      }
    }
  };

  var X = P.X[L];
  if (X && P.designs) {
    P.designs.forEach(function (d) { var v = X.designs[d.id]; if (v) { d.t.head = v[0]; d.t.sub = v[1]; d.t.cta = v[2]; d.about = v[3]; } });
    P.pilk.t.head = X.pilk[0]; P.pilk.t.sub = X.pilk[1]; P.pilk.t.cta = X.pilk[2];
    var k;
    for (k in X.formats) if (P.formats[k]) { P.formats[k].n = X.formats[k][0]; P.formats[k].where = X.formats[k][1]; }
    for (k in X.packs) { P.packs[k].n = X.packs[k][0]; P.packs[k].short = X.packs[k][1]; P.packs[k].plain = X.packs[k][2]; }
    for (k in X.extras) { P.extras[k].n = X.extras[k][0]; P.extras[k].plain = X.extras[k][1]; }
    for (k in X.cats) P.cats[k] = X.cats[k];
    for (k in X.styles) P.styles[k] = X.styles[k];
    for (k in X.files) P.files[k] = X.files[k];
    for (k in X.rules) if (P.rules[k]) P.rules[k][0] = X.rules[k];
  }
})();
