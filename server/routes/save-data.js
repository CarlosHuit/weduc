import express from 'express'
import Debug from 'debug'
import { SimilarLetters, Words, Letters, Syllables, Coordinates, Courses, Combinations } from '../models';

const app = express.Router()
const debug = new Debug('WEDUC: Save Data')


app.post('', async (req, res) => {
  try {


    /* Se guardan todas la letras similares */
    for (let x = 0; x < simLetters.length; x++) {

      const element      = simLetters[x];
      const newElement   = new SimilarLetters(element)
      const saveElemente = await newElement.save()

    }


    /* Se guardan todas las palabras por letra */
    for (let i = 0; i < words.length; i++) {

      const element = words[i];
      const newElement = new Words(element)
      const saveElemente = await newElement.save()

    }

    /* Se guardar todas las palbras divididas en silabas */
    for (let r = 0; r < syllablesList.length; r++) {

      const element = syllablesList[r];
      const newSyllables = new Syllables(element)
      const saveSyllables = await newSyllables.save()

    }

    /* Se guardan todas las coordenadas */
    for (let q = 0; q < coordinates.length; q++) {

      const element = coordinates[q];
      const newCoordinates = new Coordinates(element)
      const saveCoordinates = await newCoordinates.save()
      

    }

    /* Se guarda la informacion de los cursos */
    for (let i = 0; i < subjects.length; i++) {

      const e = subjects[i];
      const newCourse = new Courses({
          title:       e.title,
          subtitle:    e.subtitle,
          imageUrl:    e.imageUrl,
          urlVideo:    e.urlVideo,
          description: e.description,
      })

      const saveNewCourse = await newCourse.save();
    }

    for (let i = 0; i < combinations.length; i++) {
      const element = combinations[i];
      const t = new Combinations({
        letter: element.letter,
        combinations: element.combinations
      })

      const save = await t.save()
      
    }

    /* Se guardan el alfabeto, las vocales y las consonantes */
    const newElement = new Letters(letters)
    const saveElemente = await newElement.save()


    res.status(200).json('datos guardados')
    debug('Guardando la informacion en la base de datos')

  } catch (error) {

    debug(error)

  }

})

export default app

const syllablesList = [
  { letter: 'a', syllables: ['ar-pa',        'ar-di-lla',    'a-ni-llo'                                                ]},
  { letter: 'b', syllables: ['ba-lle-na',    'bar-co',       'bi-ci-cle-ta',   'bu-rro',     'bu-que'                  ]},
  { letter: 'c', syllables: ['ca-mi-sa',     'ca-sa',        'ca-rro',         'co-ne-jo',   'co-co',    'ca-ma',      ]},
  { letter: 'd', syllables: ['de-do',        'da-do',        'di-no-sau-rio',  'di-ne-ro',   'dul-ce'                  ]},
  { letter: 'e', syllables: ['e-le-fan-te',  'es-ca-le-ra',  'es-tre-lla',     'es-pe-jo'                              ]},
  { letter: 'f', syllables: ['fue-go',       'fre-sa',       'fi-es-ta',       'fi-de-o',    'fru-ta'                  ]},
  { letter: 'g', syllables: ['ga-to',        'ga-lle-ta',    'gui-ta-rra',     'ge-la-ti-na'                           ]},
  { letter: 'h', syllables: ['hue-vo',       'hie-lo',       'hue-so',         'he-la-do'                              ]},
  { letter: 'i', syllables: ['is-la',        'in-vier-no',   'in-dio',         'i-dio-ma'                              ]},
  { letter: 'j', syllables: ['jue-go',       'ji-ra-fa',     'ju-gue-te',      'ju-go',      'ja-guar'                 ]},
  { letter: 'k', syllables: ['ko-a-la',      'kios-co',      'ki-mo-no',       'ki-wi'                                 ]},
  { letter: 'l', syllables: ['lu-na',        'lo-bo',        'li-bro',         'lo-ro'                                 ]},
  { letter: 'm', syllables: ['mo-no',        'ma-no',        'mo-li-no',       'ma-pa',      'me-sa',    'ma-ri-po-sa' ]},
  { letter: 'n', syllables: ['nu-be',        'ni-ño',        'na-riz',         'na-ve',      'no-che',   'nie-ve'      ]},
  { letter: 'ñ', syllables: ['ñan-du',       'pi-ña-ta',     'pi-ña'                                                   ]},
  { letter: 'o', syllables: ['o-ve-ja',      'o-re-ja',      'o-fi-ci-na'                                              ]},
  { letter: 'p', syllables: ['pal-me-ra',    'pe-lo-ta',     'pe-ra',          'pa-to',      'pa-ya-so'                ]},
  { letter: 'q', syllables: ['que-so',       'que-ru-bín',   'qui-mi-ca'                                               ]},
  { letter: 'r', syllables: ['ra-ma',        're-loj',       'ra-na',          'rue-da',     'ri-sa',    'ra-que-ta',  ]},
  { letter: 's', syllables: ['so-pa',        'si-re-na',     'sa-po',          'som-bre-ro'                            ]},
  { letter: 't', syllables: ['ta-za',        'tam-bor',      'ti-gre',         'te-ne-dor',  'to-ma-te', 'ti-je-ra'    ]},
  { letter: 'u', syllables: ['u-ni-ver-so',  'u-ni-for-me',  'u-ni-cor-nio',                                           ]},
  { letter: 'v', syllables: ['va-ca',        'ven-ta-na',    'va-cu-na',       've-la',      've-ra-no', 'ves-ti-do'   ]},
  { letter: 'w', syllables: ['wa', 'ffle',   'walk-man',     'wal-ter'                                                 ]},
  { letter: 'x', syllables: ['ta-xi',        'bo-xe-a-dor'                                                             ]},
  { letter: 'y', syllables: ['ye-so',        'ya-te',        'ye-ma',          'yo-gurt'                               ]},
  { letter: 'z', syllables: ['za-pa-to',     'zo-rro',       'za-na-ho-ria'                                            ]}
];


const letters = {

  alphabet:   'abcdefghijklmnñopqrstuvwxyz',
  consonants: 'bcdfghjklmnñpqrstvwxyz',
  vocals:     'aeiou',
  combinations: {
    a:  [
          {w: 'aa', p: 'aa'},
          {w: 'ae', p: 'ae'},
          {w: 'ai', p: 'ai'},
          {w: 'ao', p: 'ao'},
          {w: 'au', p: 'au'},
        ],
    b:  [
          {w: 'ba', p: 'ba'},
          {w: 'be', p: 've'},
          {w: 'bi', p: 'bi'},
          {w: 'bo', p: 'bo'},
          {w: 'bu', p: 'bu'},
        ],
    c:  [
          {w: 'ca', p: 'ca'}, 
          {w: 'ce', p: 'ce'}, 
          {w: 'ci', p: 'ci'}, 
          {w: 'co', p: 'co'}, 
          {w: 'cu', p: 'cu'},
        ],
    d:  [
          {w: 'da', p: 'da'}, 
          {w: 'de', p: 'de'}, 
          {w: 'di', p: 'di'}, 
          {w: 'do', p: 'do'}, 
          {w: 'du', p: 'du'},
        ], 
    e:  [
          {w: 'ea', p: 'ea'}, 
          {w: 'ee', p: 'ee'}, 
          {w: 'ei', p: 'ei'}, 
          {w: 'eo', p: 'eo'}, 
          {w: 'eu', p: 'eu'},
        ],
    f:  [
          {w: 'fa', p: 'fa'}, 
          {w: 'fe', p: 'fe'}, 
          {w: 'fi', p: 'fi'}, 
          {w: 'fo', p: 'fo'}, 
          {w: 'fu', p: 'fu'},
        ],
    g:  [
          {w: 'ga',  p: 'ga'  }, 
          {w: 'gue', p: 'gue' }, 
          {w: 'gui', p: 'gui' }, 
          {w: 'go',  p: 'go'  }, 
          {w: 'gu',  p: 'gu'  }, 
          {w: 'ge',  p: 'ge'}, 
          {w: 'gi',  p: 'ji'}, 

        ],
    h:  [
          {w: 'ha', p: 'a'}, 
          {w: 'he', p: 'e'}, 
          {w: 'hi', p: 'i'}, 
          {w: 'ho', p: 'o'}, 
          {w: 'hu', p: 'u'},
        ],
    i:  [
          {w: 'ia', p: 'ia'}, 
          {w: 'ie', p: 'ie'}, 
          {w: 'ii', p: 'ii'}, 
          {w: 'io', p: 'io'}, 
          {w: 'iu', p: 'iu'},
        ],
    j:  [
          {w: 'ja', p: 'ja'}, 
          {w: 'je', p: 'ge'}, 
          {w: 'ji', p: 'ji'}, 
          {w: 'jo', p: 'ho'}, 
          {w: 'ju', p: 'ju'},
        ],
    k:  [
          {w: 'ka', p: 'ka'}, 
          {w: 'ke', p: 'ke'}, 
          {w: 'ki', p: 'ki'}, 
          {w: 'ko', p: 'ko'}, 
          {w: 'ku', p: 'ku'},
        ],
    l:  [
          {w: 'la', p: 'la'}, 
          {w: 'le', p: 'le'}, 
          {w: 'li', p: 'li'}, 
          {w: 'lo', p: 'lo'}, 
          {w: 'lu', p: 'lu'},
        ],
    m:  [
          {w: 'ma', p: 'ma'}, 
          {w: 'me', p: 'me'}, 
          {w: 'mi', p: 'mi'}, 
          {w: 'mo', p: 'mo'}, 
          {w: 'mu', p: 'mu'},
        ],
    n: [
          {w: 'na', p: 'na'}, 
          {w: 'ne', p: 'ne'}, 
          {w: 'ni', p: 'ni'}, 
          {w: 'no', p: 'no'}, 
          {w: 'nu', p: '.. nu'},
        ],
    ñ:  [
          {w: 'ña', p: 'ña'}, 
          {w: 'ñe', p: 'ñe'}, 
          {w: 'ñi', p: 'ñi'}, 
          {w: 'ño', p: 'ño'}, 
          {w: 'ñu', p: 'ñu'},
        ],
    o:  [
          {w: 'oa', p: 'oa'}, 
          {w: 'oe', p: 'oe'}, 
          {w: 'oi', p: 'oi'}, 
          {w: 'oo', p: 'oo'}, 
          {w: 'ou', p: 'ou'},
        ],
    p:  [
          {w: 'pa', p: 'pa'}, 
          {w: 'pe', p: 'pe'}, 
          {w: 'pi', p: 'pi'}, 
          {w: 'po', p: 'po'}, 
          {w: 'pu', p: 'pu'},
        ],
    q:  [
          {w: 'que', p: 'que'}, 
          {w: 'qui', p: 'qui'}, 
        ],
    r:  [
          {w: 'ra', p: 'ra'}, 
          {w: 're', p: 're'}, 
          {w: 'ri', p: 'ri'}, 
          {w: 'ro', p: 'ro'}, 
          {w: 'ru', p: 'ru'},
        ],
    s:  [
          {w: 'sa', p: 'sa'}, 
          {w: 'se', p: 'se'}, 
          {w: 'si', p: 'si'}, 
          {w: 'so', p: 'so'}, 
          {w: 'su', p: 'su'},
        ],
    t:  [
          {w: 'ta', p: 'ta'}, 
          {w: 'te', p: 'te'}, 
          {w: 'ti', p: '.. tii'}, 
          {w: 'to', p: '.. tow'}, 
          {w: 'tu', p: 'tu'},
        ],
    u:  [
          {w: 'ua', p: '.. uha'}, 
          {w: 'ue', p: '.. uhe'}, 
          {w: 'ui', p: '.. uy'}, 
          {w: 'uo', p: 'uo'}, 
          {w: 'uu', p: 'u, u'},
        ],
    v:  [
          {w: 'va', p: 'va'}, 
          {w: 've', p: 've'}, 
          {w: 'vi', p: 'vi'}, 
          {w: 'vo', p: 'vo'}, 
          {w: 'vu', p: 'vu'},
        ],
    w:  [
          {w: 'wa', p: 'wa'}, 
          {w: 'we', p: 'we'}, 
          {w: 'wi', p: 'wi'}, 
          {w: 'wo', p: 'wo'}, 
          {w: 'wu', p: 'wu'},
        ],
    x:  [
          {w: 'xa', p: 'xa'}, 
          {w: 'xe', p: 'xe'}, 
          {w: 'xi', p: 'xi'}, 
          {w: 'xo', p: 'so'}, 
          {w: 'xu', p: 'xu'},
        ],
    y:  [
          {w: 'ya', p: 'ya'}, 
          {w: 'ye', p: '.. ihe'}, 
          {w: 'yi', p: 'yi'}, 
          {w: 'yo', p: 'yo'}, 
          {w: 'yu', p: 'yu'},
        ],
    z:  [
          {w: 'za', p: 'za'}, 
          {w: 'ze', p: 'ze'}, 
          {w: 'zi', p: 'zi'}, 
          {w: 'zo', p: 'zo'}, 
          {w: 'zu', p: 'zu'},
        ],
  },
  sound_letters: {
    a: '"ha"',
    á: '"ha"',
    b: '"b"',
    c: '"ce"',
    d: '"d"',
    e: '"e"',
    é: '"e"',
    f: '"f"',
    g: '"ge"',
    h: '"ache"',
    i: '"i"',
    í: '"i"',
    j: "...jota",
    k: '"ka"',
    l: 'l',
    m: '"eme"',
    n: '"ene"',
    ñ: '"eñe"',
    o: '"oh"',
    ó: '"oh"',
    p: '.. p',
    q: '"cu"',
    r: '"erre"',
    s: '"ese"',
    t: '.. te',
    u: '"u .."',
    ú: '"u .."',
    v: '"uve"',
    w: '"doble ve"',
    x: '".. equis"',
    y: 'ihe"',
    z: 'seta'
  }
}


const combinations = [
  {
    letter: 'a',
    combinations: [
      {
        combination: 'aa',
        syllable:    { w: 'aa', p: 'aa'},
        word:        'portaaviones',
        syllables:   ['port', 'aa', 'viones'],
      },
      {
        combination: 'ae',
        syllable:    {w: 'ae', p: 'ae'},
        word:        'aeropuerto',
        syllables:   ['ae', 'ropuerto'],
      },
      {
        combination: 'ai',
        syllable:    {w: 'ai', p: 'ai'},
        word:        'paisaje',
        syllables:   ['p', 'ai', 'saje'],
      },
      {
        combination: 'ao',
        syllable:    {w: 'ao', p: 'ao'},
        word:        'karaoke',
        syllables:   ['kar', 'ao', 'ke'],
      },
      {
        combination: 'au',
        syllable:    {w: 'au', p: 'au'},
        word:        'jaula',
        syllables:   ['j', 'au', 'la'],
      }
    ]
  },
  {
    letter: 'b',
    combinations: [
      {
        combination: 'ba',
        syllable:    {w: 'ba', p: 'ba'},
        word:        'barco',
        syllables:   ['ba', 'rco'],
      },
      {
        combination: 'be',
        syllable:    {w: 'be', p: 've'},
        word:        'becerro',
        syllables:   ['be', 'cerro'],
      },
      {
        combination: 'bi',
        syllable:    {w: 'bi', p: 'bi'},
        word:        'bicicleta',
        syllables:   ['bi', 'cicleta'],
      },
      {
        combination: 'bo',
        syllable:    {w: 'bo', p: 'bo'},
        word:        'bota',
        syllables:   ['bo', 'ta'],
      },
      {
        combination: 'bu',
        syllable:    {w: 'bu', p: 'bu'},
        word:        'burro',
        syllables:   ['bu', 'rro'],
      }
    ]
  },
  {
    letter: 'c',
    combinations: [
      {
        combination: 'ca',
        syllable:    {w: 'ca', p: 'ca'},
        word:        'casa',
        syllables:   ['ca', 'sa'],
      },
      {
        combination: 'ce',
        syllable:    {w: 'ce', p: 'ce'},
        word:        'cebolla',
        syllables:   ['ce', 'bolla'],
      },
      {
        combination: 'ci',
        syllable:    {w: 'ci', p: 'ci'},
        word:        'cine',
        syllables:   ['ci', 'ne'],
      },
      {
        combination: 'co',
        syllable:    {w: 'co', p: 'co'},
        word:        'coco',
        syllables:   ['co', 'co'],
      },
      {
        combination: 'cu',
        syllable:    {w: 'cu', p: 'cu'},
        word:        'cuna',
        syllables:   ['cu', 'na'],
      }
    ]
  },
  {
    letter: 'd',
    combinations: [
      {
        combination: 'da',
        syllable:    {w: 'da', p: 'da'},
        word:        'dado',
        syllables:   ['da', 'do'],
      },
      {
        combination: 'de',
        syllable:    {w: 'de', p: 'de'},
        word:        'dedo',
        syllables:   ['de', 'do'],
      },
      {
        combination: 'di',
        syllable:    {w: 'di', p: 'di'},
        word:        'dinero',
        syllables:   ['di', 'nero'],
      },
      {
        combination: 'do',
        syllable:    {w: 'do', p: 'do'},
        word:        'dona',
        syllables:   ['do', 'na'],
      },
      {
        combination: 'du',
        syllable:    {w: 'du', p: 'du'},
        word:        'dulce',
        syllables:   ['du', 'lce'],
      }
    ]
  },
  {
    letter: 'e',
    combinations: [
      {
        combination: 'ea',
        syllable:    {w: 'ea', p: 'ea'},
        word:        'aldea',
        syllables:   ['ald', 'ea'],
      },
      {
        combination: 'ee',
        syllable:    {w: 'ee', p: 'ee'},
        word:        'leer',
        syllables:   ['l', 'ee', 'r'],
      },
      {
        combination: 'ei',
        syllable:    {w: 'ei', p: 'ei'},
        word:        'aceite',
        syllables:   ['ac', 'ei', 'te'],
      },
      {
        combination: 'eo',
        syllable:    {w: 'eo', p: 'eo'},
        word:        'fideo',
        syllables:   ['fid', 'eo'],
      },
      {
        combination: 'eu',
        syllable:    {w: 'eu', p: 'eu'},
        word:        'reunión',
        syllables:   ['r', 'eu', 'nión'],
      }
    ]
  },
  {
    letter: 'f',
    combinations: [
      {
        combination: 'fa',
        syllable:    {w: 'fa', p: 'fa'},
        word:        'faro',
        syllables:   ['fa', 'ro'],
      },
      {
        combination: 'fe',
        syllable:    {w: 'fe', p: 'fe'},
        word:        'feliz',
        syllables:   ['fe', 'liz'],
      },
      {
        combination: 'fi',
        syllable:    {w: 'fi', p: 'fi'},
        word:        'fiesta',
        syllables:   ['fi', 'esta'],
      },
      {
        combination: 'fo',
        syllable:    {w: 'fo', p: 'fo'},
        word:        'foco',
        syllables:   ['fo', 'co'],
      },
      {
        combination: 'fu',
        syllable:    {w: 'fu', p: 'fu'},
        word:        'fuego',
        syllables:   ['fu', 'ego'],
      }
    ]
  },
  {
    letter: 'g',
    combinations: [
      {
        combination: 'ga',
        syllable:    {w: 'ga', p: 'ga'},
        word:        'gato',
        syllables:   ['ga', 'to'],
      },
      {
        combination: 'gue',
        syllable:    {w: 'gue', p: 'gue'},
        word:        'guerrero',
        syllables:   ['gue', 'rrero'],
      },
      {
        combination: 'gui',
        syllable:    {w: 'gui', p: 'gui'},
        word:        'guitarra',
        syllables:   ['gui', 'tarra'],
      },
      {
        combination: 'go',
        syllable:    {w: 'go', p: 'go'},
        word:        'gorra',
        syllables:   ['go', 'rra'],
      },
      {
        combination: 'gu',
        syllable:    {w: 'gu', p: 'gu'},
        word:        'gusano',
        syllables:   ['gu', 'sano'],
      },
      {
        combination: 'ge',
        syllable:    {w: 'ge', p: 'ge'},
        word:        'gelatina',
        syllables:   ['ge', 'latina'],
      },
      {
        combination: 'gi',
        syllable:    {w: 'gi', p: 'ji'},
        word:        'girasol',
        syllables:   ['gi', 'rasol'],
      },
      {
        combination: 'gua',
        syllable:    {w: 'gua', p: 'gua'},
        word:        'agua',
        syllables:   ['a', 'gua'],
      },
      {
        combination: 'güe',
        syllable:    {w: 'güe', p: 'güe'},
        word:        'cigüeñas',
        syllables:   ['ci', 'güe', 'ña'],
      },
      {
        combination: 'güi',
        syllable:    {w: 'güi', p: 'güi'},
        word:        'pingüino',
        syllables:   ['pin', 'güi', 'no'],
      },
      {
        combination: 'guo',
        syllable:    {w: 'guo', p: 'guo'},
        word:        'antiguo',
        syllables:   ['anti', 'guo'],
      }
    ]
  },
  {
    letter: 'h',
    combinations: [
      {
        combination: 'ha',
        syllable:    {w: 'ha', p: 'a'},
        word:        'hacha',
        syllables:   ['ha', 'cha'],
      },
      {
        combination: 'he',
        syllable:    {w: 'he', p: 'e'},
        word:        'helado',
        syllables:   ['he', 'la', 'do'],
      },
      {
        combination: 'hi',
        syllable:    {w: 'hi', p: 'i'},
        word:        'hilo',
        syllables:   ['hi', 'lo'],
      },
      {
        combination: 'ho',
        syllable:    {w: 'ho', p: 'o'},
        word:        'horno',
        syllables:   ['ho', 'rno'],
      },
      {
        combination: 'hu',
        syllable:    {w: 'hu', p: 'u'},
        word:        'hueso',
        syllables:   ['hu', 'eso'],
      }
    ]
  },
  {
    letter: 'i',
    combinations: [
      {
        combination: 'ia',
        syllable:    {w: 'ia', p: 'ia'},
        word:        'familia',
        syllables:   ['famil', 'ia'],
      },
      {
        combination: 'ie',
        syllable:    {w: 'ie', p: 'ie'},
        word:        'pie',
        syllables:   ['p', 'ie'],
      },
      {
        combination: 'ii',
        syllable:    {w: 'ii', p: 'ii'},
        word:        'hawaii',
        syllables:   ['hawa', 'ii'],
      },
      {
        combination: 'io',
        syllable:    {w: 'io', p: 'io'},
        word:        'apio',
        syllables:   ['ap', 'io'],
      },
      {
        combination: 'iu',
        syllable:    {w: 'iu', p: 'iu'},
        word:        'ciudad',
        syllables:   ['c', 'iu', 'dad'],
      }
    ]
  },
  {
    letter: 'j',
    combinations: [
      {
        combination: 'ja',
        syllable:    {w: 'ja', p: 'ja'},
        word:        'jaula',
        syllables:   ['ja', 'ula'],
      },
      {
        combination: 'je',
        syllable:    {w: 'je', p: 'ge'},
        word:        'jefe',
        syllables:   ['je', 'fe'],
      },
      {
        combination: 'ji',
        syllable:    {w: 'ji', p: 'ji'},
        word:        'jirafa',
        syllables:   ['ji', 'rafa'],
      },
      {
        combination: 'jo',
        syllable:    {w: 'jo', p: 'ho'},
        word:        'joya',
        syllables:   ['jo', 'ya'],
      },
      {
        combination: 'ju',
        syllable:    {w: 'ju', p: 'ju'},
        word:        'juguete',
        syllables:   ['ju', 'guete'],
      }
    ]
  },
  {
    letter: 'k',
    combinations: [
      {
        combination: 'ka',
        syllable:    {w: 'ka', p: 'ka'},
        word:        'karate',
        syllables:   ['ka', 'rate'],
      },
      {
        combination: 'ke',
        syllable:    {w: 'ke', p: 'ke'},
        word:        'kermés',
        syllables:   ['ke', 'rmés'],
      },
      {
        combination: 'ki',
        syllable:    {w: 'ki', p: 'ki'},
        word:        'kilo',
        syllables:   ['ki', 'lo'],
      },
      {
        combination: 'ko',
        syllable:    {w: 'ko', p: 'ko'},
        word:        'koala',
        syllables:   ['ko', 'ala'],
      },
      {
        combination: 'ku',
        syllable:    {w: 'ku', p: 'ku'},
        word:        'kung-fu',
        syllables:   ['ku', 'ng-fu'],
      }
    ]
  },
  {
    letter: 'l',
    combinations: [
      {
        combination: 'la',
        syllable:    {w: 'la', p: 'la'},
        word:        'lana',
        syllables:   ['la' ,'na'],
      },
      {
        combination: 'le',
        syllable:    {w: 'le', p: 'le'},
        word:        'león',
        syllables:   ['le', 'ón'],
      },
      {
        combination: 'li',
        syllable:    {w: 'li', p: 'li'},
        word:        'libro',
        syllables:   ['li', 'bro'],
      },
      {
        combination: 'lo',
        syllable:    {w: 'lo', p: 'lo'},
        word:        'lobo',
        syllables:   ['lo', 'bo'],
      },
      {
        combination: 'lu',
        syllable:    {w: 'lu', p: 'lu'},
        word:        'luna',
        syllables:   ['lu', 'na'],
      }
    ]
  },
  {
    letter: 'm',
    combinations: [
      {
        combination: 'ma',
        syllable:    {w: 'ma', p: 'ma'},
        word:        'mapa',
        syllables:   ['ma', 'pa'],
      },
      {
        combination: 'me',
        syllable:    {w: 'me', p: 'me'},
        word:        'mesa',
        syllables:   ['me', 'sa'],
      },
      {
        combination: 'mi',
        syllable:    {w: 'mi', p: 'mi'},
        word:        'mimo',
        syllables:   ['mi' ,'mo'],
      },
      {
        combination: 'mo',
        syllable:    {w: 'mo', p: 'mo'},
        word:        'mono',
        syllables:   ['mo', 'no'],
      },
      {
        combination: 'mu',
        syllable:    {w: 'mu', p: 'mu'},
        word:        'mundo',
        syllables:   ['mu', 'ndo'],
      }
    ]
  },
  {
    letter: 'n',
    combinations: [
      {
        combination: 'na',
        syllable:    {w: 'na', p: 'na'},
        word:        'nave',
        syllables:   ['na', 've'],
      },
      {
        combination: 'ne',
        syllable:    {w: 'ne', p: 'ne'},
        word:        'negro',
        syllables:   ['ne', 'gro'],
      },
      {
        combination: 'ni',
        syllable:    {w: 'ni', p: 'ni'},
        word:        'niño',
        syllables:   ['ni', 'ño'],
      },
      {
        combination: 'no',
        syllable:    {w: 'no', p: 'no'},
        word:        'nota',
        syllables:   ['no' ,'ta'],
      },
      {
        combination: 'nu',
        syllable:    {w: 'nu', p: '.. nu'},
        word:        'nuez',
        syllables:   ['nu', 'ez'],
      }
    ]
  },
  {
    letter: 'ñ',
    combinations: [
      {
        combination: 'ñ',
        syllable:    {w: 'ña', p: 'ña'},
        word:        'ñandú',
        syllables:   ['ña', 'ndú'],
      },
      {
        combination: 'ñe',
        syllable:    {w: 'ñe', p: 'ñe'},
        word:        'muñeco',
        syllables:   ['mu', 'ñe', 'co'],
      },
      {
        combination: 'ñi',
        syllable:    {w: 'ñi', p: 'ñi'},
        word:        'albañil',
        syllables:   ['alba', 'ñi', 'l'],
      },
      {
        combination: 'ño',
        syllable:    {w: 'ño', p: 'ño'},
        word:        'ñoño',
        syllables:   ['ño', 'ño'],
      },
      {
        combination: 'ñu',
        syllable:    {w: 'ñu', p: 'ñu'},
        word:        'pañuelo',
        syllables:   ['pa', 'ñu', 'elo'],
      }
    ]
  },
  {
    letter: 'o',
    combinations: [
      {
        combination: 'oa',
        syllable:    {w: 'oa', p: 'oa'},
        word:        'koala',
        syllables:   ['k', 'oa', 'la'],
      },
      {
        combination: 'oe',
        syllable:    {w: 'oe', p: 'oe'},
        word:        'héroe',
        syllables:   ['hér', 'oe'],
      },
      {
        combination: 'oi',
        syllable:    {w: 'oi', p: 'oi'},
        word:        'arcoiris',
        syllables:   ['arc', 'oi', 'ris'],
      },
      {
        combination: 'oo',
        syllable:    {w: 'oo', p: 'oo'},
        word:        'zoología',
        syllables:   ['z', 'oo', 'logía'],
      }
    ]
  },
  {
    letter: 'p',
    combinations: [
      {
        combination: 'pa',
        syllable:    {w: 'pa', p: 'pa'},
        word:        'pantalla',
        syllables:   ['pa', 'ntalla'],
      },
      {
        combination: 'pe',
        syllable:    {w: 'pe', p: 'pe'},
        word:        'pera',
        syllables:   ['pe', 'ra'],
      },
      {
        combination: 'pi',
        syllable:    {w: 'pi', p: 'pi'},
        word:        'pino',
        syllables:   ['pi', 'no'],
      },
      {
        combination: 'po',
        syllable:    {w: 'po', p: 'po'},
        word:        'pollo',
        syllables:   ['po', 'llo'],
      },
      {
        combination: 'pu',
        syllable:    {w: 'pu', p: 'pu'},
        word:        'puerta',
        syllables:   ['pu', 'erta'],
      }
    ]
  },
  {
    letter: 'q',
    combinations: [
      {
        combination: 'que',
        syllable:    {w: 'que', p: 'que'},
        word:        'queso',
        syllables:   ['que', 'so'],
      },
      {
        combination: 'qui',
        syllable:    {w: 'qui', p: 'qui'},
        word:        'quintal',
        syllables:   ['qui', 'ntal'],
      }
    ]
  },
  {
    letter: 'r',
    combinations: [
      {
        combination: 'ra',
        syllable:    {w: 'ra', p: 'ra'},
        word:        'rana',
        syllables:   ['ra', 'na'],
      },
      {
        combination: 're',
        syllable:    {w: 're', p: 're'},
        word:        'rey',
        syllables:   ['re', 'y'],
      },
      {
        combination: 'ri',
        syllable:    {w: 'ri', p: 'ri'},
        word:        'risa',
        syllables:   ['ri', 'sa'],
      },
      {
        combination: 'ro',
        syllable:    {w: 'ro', p: 'ro'},
        word:        'rosa',
        syllables:   ['ro', 'sa'],
      },
      {
        combination: 'ru',
        syllable:    {w: 'ru', p: 'ru'},
        word:        'rueda',
        syllables:   ['ru', 'eda'],
      }
    ]
  },
  {
    letter: 's',
    combinations: [
      {
        combination: 'sa',
        syllable:    {w: 'sa', p: 'sa'},
        word:        'sapo',
        syllables:   ['sa', 'po'],
      },
      {
        combination: 'se',
        syllable:    {w: 'se', p: 'se'},
        word:        'semáforo',
        syllables:   ['se', 'máforo'],
      },
      {
        combination: 'si',
        syllable:    {w: 'si', p: 'si'},
        word:        'silla',
        syllables:   ['si', 'lla'],
      },
      {
        combination: 'so',
        syllable:    {w: 'so', p: 'so'},
        word:        'sopa',
        syllables:   ['so', 'pa'],
      },
      {
        combination: 'su',
        syllable:    {w: 'su', p: 'su'},
        word:        'sumar',
        syllables:   ['su', 'mar'],
      }
    ]
  },
  {
    letter: 't',
    combinations: [
      {
        combination: 'ta',
        syllable:    {w: 'ta', p: 'ta'},
        word:        'taza',
        syllables:   ['ta', 'za'],
      },
      {
        combination: 'te',
        syllable:    {w: 'te', p: 'te'},
        word:        'tenedor',
        syllables:   ['te', 'nedor'],
      },
      {
        combination: 'ti',
        syllable:    {w: 'ti', p: '.. ti'},
        word:        'tigre',
        syllables:   ['ti', 'gre'],
      },
      {
        combination: 'to',
        syllable:    {w: 'to', p: '.. tow'},
        word:        'tomate',
        syllables:   ['to', 'mate'],
      },
      {
        combination: 'tu',
        syllable:    {w: 'tu', p: 'tu'},
        word:        'tucán',
        syllables:   ['tu', 'cán'],
      }
    ]
  },
  {
    letter: 'u',
    combinations: [
      {
        combination: 'ua',
        syllable:    {w: 'ua', p: '.. uha'},
        word:        'agua',
        syllables:   ['ag', 'ua'],
      },
      {
        combination: 'ue',
        syllable:    {w: 'ue', p: '.. uhe'},
        word:        'huevo',
        syllables:   ['h', 'ue', 'vo'],
      },
      {
        combination: 'ui',
        syllable:    {w: 'ui', p: '.. uy'},
        word:        'cuidado',
        syllables:   ['c', 'ui', 'dado'],
      },
      {
        combination: 'uo',
        syllable:    {w: 'uo', p: 'uo'},
        word:        'monstruo',
        syllables:   ['monstr', 'uo'],
      }
    ]
  },
  {
    letter: 'v',
    combinations: [
      {
        combination: 'va',
        syllable:    {w: 'va', p: 'va'},
        word:        'vaca',
        syllables:   ['va', 'ca'],
      },
      {
        combination: 've',
        syllable:    {w: 've', p: 've'},
        word:        'vela',
        syllables:   ['ve', 'la'],
      },
      {
        combination: 'vi',
        syllable:    {w: 'vi', p: 'vi'},
        word:        'viento',
        syllables:   ['vi', 'ento'],
      },
      {
        combination: 'vo',
        syllable:    {w: 'vo', p: 'vo'},
        word:        'volcán',
        syllables:   ['vo', 'lcán'],
      },
      {
        combination: 'vu',
        syllable:    {w: 'vu', p: 'vu'},
        word:        'vuelo',
        syllables:   ['vu', 'elo'],
      }
    ]
  },
  {
    letter: 'w',
    combinations: [
      {
        combination: 'wa',
        syllable:    {w: 'wa', p: 'wa'},
        word:        'waterpolo',
        syllables:   ['wa', 'terpolo'],
      },
      {
        combination: 'we',
        syllable:    {w: 'we', p: 'we'},
        word:        'web',
        syllables:   ['we', 'b'],
      },
      {
        combination: 'wi',
        syllable:    {w: 'wi', p: 'wi'},
        word:        'sándwich',
        syllables:   ['sánd', 'wi', 'ch'],
      },
      {
        combination: 'wo',
        syllable:    {w: 'wo', p: 'wo'},
        word:        'wow',
        syllables:   ['wo', 'w'],
      },
      {
        combination: 'wu',
        syllable:    {w: 'wu', p: 'wu'},
        word:        'wu',
        syllables:   ['wu'],
      }
    ]
  },
  {
    letter: 'x',
    combinations: [
      {
        combination: 'xa',
        syllable:    {w: 'xa', p: 'xa'},
        word:        'exacto',
        syllables:   ['e', 'xa', 'cto'],
      },
      {
        combination: 'xe',
        syllable:    {w: 'xe', p: 'xe'},
        word:        'boxeador',
        syllables:   ['bo', 'xe', 'ador'],
      },
      {
        combination: 'xi',
        syllable:    {w: 'xi', p: 'xi'},
        word:        'taxi',
        syllables:   ['ta', 'xi'],
      },
      {
        combination: 'xo',
        syllable:    {w: 'xo', p: 'so'},
        word:        'saxofón',
        syllables:   ['sa', 'xo', 'fón'],
      },
      {
        combination: 'xu',
        syllable:    {w: 'xu', p: 'xu'},
        word:        'sexualidad',
        syllables:   ['se', 'xu', 'alidad'],
      }
    ]
  },
  {
    letter: 'y',
    combinations: [
      {
        combination: 'ya',
        syllable:    {w: 'ya', p: 'ya'},
        word:        'yate',
        syllables:   ['ya', 'te'],
      },
      {
        combination: 'ye',
        syllable:    {w: 'ye', p: '.. ihe'},
        word:        'yeso',
        syllables:   ['ye', 'so'],
      },
      {
        combination: 'yi',
        syllable:    {w: 'yi', p: 'yi'},
        word:        'rayito',
        syllables:   ['ra', 'yi', 'to'],
      },
      {
        combination: 'yo',
        syllable:    {w: 'yo', p: 'yo'},
        word:        'yoyo',
        syllables:   ['yo', 'yo'],
      },
      {
        combination: 'yu',
        syllable:    {w: 'yu', p: 'yu'},
        word:        'yunque',
        syllables:   ['yu', 'nque'],
      }
    ]
  },
  {
    letter: 'z',
    combinations: [
      {
        combination: 'za',
        syllable:    {w: 'za', p: 'za'},
        word:        'zapato',
        syllables:   ['za', 'pato'],
      },
      {
        combination: 'ze',
        syllable:    {w: 'ze', p: 'ze'},
        word:        'zeta',
        syllables:   ['ze', 'ta'],
      },
      {
        combination: 'zi',
        syllable:    {w: 'zi', p: 'zi'},
        word:        'zigzag',
        syllables:   ['zi', 'gzag'],
      },
      {
        combination: 'zo',
        syllable:    {w: 'zo', p: 'zo'},
        word:        'zorro',
        syllables:   ['zo','rro'],
      },
      {
        combination: 'zu',
        syllable:    {w: 'zu', p: 'zu'},
        word:        'azul',
        syllables:   ['a', 'zu', 'l'],
      }
    ]
  }
]


const simLetters = [
  { letter: 'a', similarLetters: ['k', 'g', 'd', 'o', 'b', 'p', 'q']},
  { letter: 'b', similarLetters: ['r', 'd', 'p', 'q', 'g', 'c', 'v']},
  { letter: 'c', similarLetters: ['m', 's', 'z', 'e', 'd', 'b', 'q']},
  { letter: 'd', similarLetters: ['c', 'b', 'p', 'q', 'g', 'v', 'a']},
  { letter: 'e', similarLetters: ['f', 'g', 'r', 'c', 'd', 'b', 'o']},
  { letter: 'f', similarLetters: ['e', 't', 'r', 'd', 'l', 'i', 'h']},
  { letter: 'g', similarLetters: ['b', 'a', 'p', 'q', 'o', 'r', 'c']},
  { letter: 'h', similarLetters: ['r', 'ñ', 'n', 'm', 'd', 'u', 'b']},
  { letter: 'i', similarLetters: ['k', 'j', 'l', 'y', 'r', 't', 'h']},
  { letter: 'j', similarLetters: ['l', 'i', 'g', 'p', 'q', 'y', 't']},
  { letter: 'k', similarLetters: ['y', 'c', 'q', 'p', 'r', 'x', 'a']},
  { letter: 'l', similarLetters: ['b', 'i', 'j', 't', 'k', 'h', 'f']},
  { letter: 'm', similarLetters: ['f', 'ñ', 'n', 'h', 'r', 'w', 'v']},
  { letter: 'n', similarLetters: ['b', 'm', 'ñ', 'h', 'r', 'w', 'v']},
  { letter: 'ñ', similarLetters: ['f', 'n', 'm', 'h', 'r', 'g', 'c']},
  { letter: 'o', similarLetters: ['g', 'p', 'q', 'd', 'b', 'a', 'c']},
  { letter: 'p', similarLetters: ['e', 'q', 'd', 'b', 'g', 'o', 'a']},
  { letter: 'q', similarLetters: ['u', 'p', 'd', 'b', 'g', 'o', 'a']},
  { letter: 'r', similarLetters: ['n', 'c', 'g', 'f', 't', 'a', 'y']},
  { letter: 's', similarLetters: ['r', 'c', 'z', 'g', 'a', 'u', 'm']},
  { letter: 't', similarLetters: ['e', 'f', 'l', 'i', 'r', 'y', 'h']},
  { letter: 'u', similarLetters: ['n', 'o', 'q', 'p', 'v', 'w', 'c']},
  { letter: 'v', similarLetters: ['n', 'e', 'u', 'y', 'x', 'a', 'w']},
  { letter: 'w', similarLetters: ['n', 'v', 'u', 'y', 'x', 'z', 'm']},
  { letter: 'x', similarLetters: ['e', 'v', 'w', 'y', 'z', 'k', 'c']},
  { letter: 'y', similarLetters: ['d', 'i', 'v', 'g', 'x', 'k', 'q']},
  { letter: 'z', similarLetters: ['f', 's', 'c', 'x', 'y', 'h', 'w']},
  { letter: 'A', similarLetters: ['Y', 'V', 'W', 'X', 'N', 'K', 'M']},
  { letter: 'B', similarLetters: ['D', 'E', 'F', 'S', 'G', 'P', 'R']},
  { letter: 'C', similarLetters: ['T', 'S', 'Z', 'D', 'G', 'O', 'Q']},
  { letter: 'D', similarLetters: ['B', 'O', 'Q', 'P', 'E', 'R', 'G']},
  { letter: 'E', similarLetters: ['R', 'F', 'T', 'H', 'I', 'L', 'B']},
  { letter: 'F', similarLetters: ['R', 'E', 'T', 'H', 'L', 'K', 'P']},
  { letter: 'G', similarLetters: ['J', 'C', 'Q', 'O', 'P', 'U', 'D']},
  { letter: 'H', similarLetters: ['K', 'I', 'T', 'L', 'E', 'F', 'B']},
  { letter: 'I', similarLetters: ['Y', 'T', 'L', 'F', 'P', 'E', 'H']},
  { letter: 'J', similarLetters: ['S', 'G', 'Y', 'T', 'L', 'I', 'U']},
  { letter: 'K', similarLetters: ['A', 'Y', 'X', 'W', 'V', 'R', 'B']},
  { letter: 'L', similarLetters: ['M', 'I', 'T', 'H', 'F', 'E', 'V']},
  { letter: 'M', similarLetters: ['R', 'N', 'Ñ', 'W', 'V', 'Y', 'K']},
  { letter: 'N', similarLetters: ['R', 'M', 'Ñ', 'W', 'V', 'Y', 'K']},
  { letter: 'Ñ', similarLetters: ['R', 'M', 'N', 'W', 'V', 'Y', 'K']},
  { letter: 'O', similarLetters: ['B', 'Q', 'G', 'D', 'C', 'U', 'R']},
  { letter: 'P', similarLetters: ['E', 'R', 'Q', 'K', 'D', 'B', 'G']},
  { letter: 'Q', similarLetters: ['U', 'G', 'O', 'C', 'D', 'B', 'R']},
  { letter: 'R', similarLetters: ['L', 'P', 'K', 'B', 'D', 'F', 'E']},
  { letter: 'S', similarLetters: ['M', 'C', 'Z', 'B', 'R', 'E', 'F']},
  { letter: 'T', similarLetters: ['D', 'H', 'L', 'I', 'Y', 'Z', 'P']},
  { letter: 'U', similarLetters: ['A', 'V', 'W', 'O', 'Q', 'P', 'N']},
  { letter: 'V', similarLetters: ['Q', 'W', 'A', 'N', 'M', 'U', 'Ñ']},
  { letter: 'W', similarLetters: ['A', 'M', 'V', 'U', 'K', 'X', 'N']},
  { letter: 'X', similarLetters: ['E', 'K', 'Y', 'W', 'V', 'Z', 'A']},
  { letter: 'Y', similarLetters: ['I', 'X', 'K', 'T', 'L', 'V', 'W']},
  { letter: 'Z', similarLetters: ['N', 'S', 'C', 'R', 'K', 'Y', 'T']}
]


const words = [
  { letter: 'a', words: ['aguacate', 'avión',    'abeja',      'agua',     'anillo',   'arpa',     'ardilla'                 ] },
  { letter: 'b', words: ['burro',    'bota',     'baile',      'biblia',   'ballena',  'barco',    'bicicleta'               ] },
  { letter: 'c', words: ['carro',    'camión',   'casa',       'conejo',   'coco',     'campana',  'caballo',   'cama'       ] },
  { letter: 'd', words: ['dado',     'delfín',   'duende',     'diamante', 'doctor',   'dedo',     'dulce'                   ] },
  { letter: 'e', words: ['elefante', 'estrella', 'escalera',   'escoba',   'espejo',   'edificio', 'elote'                   ] },
  { letter: 'f', words: ['Francia',  'fósforo',  'fuego',      'fruta',    'fresa',    'flor',     'flauta',    'fuente'     ] },
  { letter: 'g', words: ['gato',     'gusano',   'gallina',    'guante',   'guitarra', 'globo',    'gelatina',  'gorra'      ] },
  { letter: 'h', words: ['hilo',     'hielo',    'huevo',      'harina',   'hormiga',  'hueso',    'helado'                  ] },
  { letter: 'i', words: ['iglesia',  'isla',     'iguana',     'iglú',     'imán',     'impresora','indio',     'idea'       ] },
  { letter: 'j', words: ['jaula',    'jarrón',   'jirafa',     'jugo',     'juguete',  'jabón',    'jaguar'                  ] },
  { letter: 'k', words: ['koala',    'kiosco',   'kimono',     'kiwi',     'kilo',     'karate',   'karaoke'                 ] },
  { letter: 'l', words: ['luna',     'lima',     'lago',       'lagarto',  'limón',    'lápiz',    'libro',     'lobo'       ] },
  { letter: 'm', words: ['mano',     'mesa',     'mapa',       'molino',   'mariposa', 'momia',    'mundo',     'medalla'    ] },
  { letter: 'n', words: ['naranja',  'niña',     'nave',       'nido',     'nube',     'nariz',    'niño',                   ] },
  { letter: 'ñ', words: ['leña',     'moño',     'otoño',      'ñandú',    'piñata',   'ñoño'                                ] },
  { letter: 'o', words: ['oso',      'oreja',    'olla',       'oveja',    'ojo',      'otoño',    'ola',       'oro'        ] },
  { letter: 'p', words: ['pera',     'pelota',   'pantalla',   'payaso',   'palmera',  'pato',     'paraguas'                ] },
  { letter: 'q', words: ['querer',   'quemar',   'querubín',   'queso',    'química'                                         ] },
  { letter: 'r', words: ['ratón',    'rosa',     'reloj',      'rueda',    'rana',     'raqueta',  'rey'                     ] },
  { letter: 's', words: ['silla',    'sol',      'sombrilla',  'sapo',     'semáforo', 'sopa',     'serpiente', 'sombrero'   ] },
  { letter: 't', words: ['taza',     'tambor',   'tigre',      'tenedor',  'teléfono', 'taxi',     'tijera',    'tomate'     ] },
  { letter: 'u', words: ['uvas',     'uno',      'unicornio',  'universo', 'uniforme', 'uña',      'urbano'                  ] },
  { letter: 'v', words: ['vaca',     'vela',     'ventana',    'viento',   'vino',     'volcán',   'vaso',      'vestido'    ] },
  { letter: 'w', words: ['waffle',   'Walter',   'walkman',    'webcam',   'waterpolo'                                       ] },
  { letter: 'x', words: ['xilófono', 'saxofón',  'taxi',       'éxito',    'boxeador'                                        ] },
  { letter: 'y', words: ['yoyo',     'yeso',     'yate',       'yema',     'yunque',   'yogurt'                              ] },
  { letter: 'z', words: ['zapato',   'zapote',   'zorro',      'zanahoria','zoológico',  'zapatilla'                         ] },
];


const subjects = [
  {
    title: 'Lectura',
    subtitle: 'lectura',
    imageUrl: 'https://21hjk03hprzp3wb3op3limx7-wpengine.netdna-ssl.com/wp-content/uploads/2015/08/reading_1440765640.jpg',
    urlVideo: 'https://www.youtube.com/embed/DNQsGz5_R04?modestbranding=1&&iv_load_policy=3',
    description: 'Aprende los conceptos básico necesarios para aprender a leer.'
  },
  {
    title:       'Escritura',
    subtitle:    'escritura',
    imageUrl:    'https://www.curiosfera.com/wp-content/uploads/2017/11/so%C3%B1ar-con-escribir.jpg',
    urlVideo:    'https://www.youtube.com/embed/KyjjFYM8aUg?start=11',
    description: 'Aprender todo lo necesario para dominar el grandioso mundo de la escritura.'
  },
  {
    title:       'Matemáticas',
    subtitle:    'matematicas',
    imageUrl:    'https://i2.wp.com/www.calculators.org/graphics/algebra.jpg?zoom=2',
    urlVideo:    'https://www.youtube.com/embed/KyjjFYM8aUg?start=11',
    description: 'Domina las operaciones aritmética básicas y aprende como usarlos en la vida real.'
  },
  {
    title:    'Arte',
    subtitle: 'arte',
    imageUrl:    'http://digo.do/wp-content/uploads/2015/02/EL-ARTE-DE-DIBUJAR.jpg',
    urlVideo:    'https://www.youtube.com/embed/mfVahyqBmC8?start=7',
    description: 'Conoce todo lo que necesitas para convertirte en un gran artista del dibujo.'
  },
  {
    title:    'Programación',
    subtitle: 'programacion',
    imageUrl:    'https://www.educaciontrespuntocero.com/wp-content/uploads/2015/12/programacion-macbook-pixabay.jpg',
    urlVideo:    'https://www.youtube.com/embed/6svvtOjLA-A?start=6',
    description: 'Aprende todos lo conceptos básico que necesitas para iniciar el maravilloso arte de la proogramacion.'
  }
];


const coordinates = [

  {
    letter: "a",
    coordinates: [
    [
      { "x": 99, "y": 56 }, 
      { "x": 99, "y": 56 }, 
      { "x": 101, "y": 54 }, 
      { "x": 119, "y": 45 }, 
      { "x": 152, "y": 45 }, 
      { "x": 166, "y": 51 }, 
      { "x": 180, "y": 66 }, 
      { "x": 190, "y": 91 }, 
      { "x": 199, "y": 147 }, 
      { "x": 201, "y": 191 }, 
      { "x": 203, "y": 230 }, 
      { "x": 207, "y": 245 }, 
      { "x": 208, "y": 250 }, 
      { "x": 208, "y": 252 }, 
      { "x": 204, "y": 235 }, 
      { "x": 191, "y": 207 }, 
      { "x": 163, "y": 176 }, 
      { "x": 130, "y": 153 }, 
      { "x": 91, "y": 147  }, 
      { "x": 67, "y": 164  }, 
      { "x": 61, "y": 205  }, 
      { "x": 71, "y": 237  },
      { "x": 93, "y": 261  },
      { "x": 150, "y": 277 },
      { "x": 194, "y": 269 },
      { "x": 213, "y": 263 },
      { "x": 218, "y": 261 }
    ]
  ]
  },
  {
    letter: "A",
    coordinates: [
    [
      { "x": 91, "y": 240 },
      { "x": 91, "y": 240 },
      { "x": 93, "y": 218 },
      { "x": 104, "y": 177 },
      { "x": 126, "y": 111 },
      { "x": 136, "y": 77 },
      { "x": 143, "y": 53 },
      { "x": 147, "y": 42 },
      { "x": 154, "y": 47 },
      { "x": 169, "y": 83 },
      { "x": 193, "y": 148 },
      { "x": 209, "y": 197 },
      { "x": 229, "y": 234  }
    ],
    [
      { "x": 104, "y": 191 },
      { "x": 104, "y": 191 },
      { "x": 161, "y": 189 },
      { "x": 212, "y": 190 }
    ]
  ]
  },
  {
    letter: "b",
    coordinates: [
    [
      { "x": 109, "y": 31 }, 
      { "x": 109, "y": 31 }, 
      { "x": 108, "y": 51 }, 
      { "x": 109, "y": 91 }, 
      { "x": 111, "y": 140 }, 
      { "x": 113, "y": 178 }, 
      { "x": 113, "y": 205 }, 
      { "x": 113, "y": 227 }, 
      { "x": 113, "y": 238 }, 
      { "x": 113, "y": 245 }, 
      { "x": 113, "y": 247 }, 
      { "x": 113, "y": 242 }, 
      { "x": 113, "y": 216 }, 
      { "x": 119, "y": 182 },
      { "x": 125, "y": 157 },
      { "x": 133, "y": 141 },
      { "x": 147, "y": 127 },
      { "x": 167, "y": 123 },
      { "x": 185, "y": 131 },
      { "x": 196, "y": 148 },
      { "x": 202, "y": 179 },
      { "x": 196, "y": 206 },
      { "x": 181, "y": 224 },
      { "x": 163, "y": 236 },
      { "x": 135, "y": 243 },
      { "x": 117, "y": 243 }
    ]
  ]
  },
  {
    letter: "B",
    coordinates: [
    [
      { "x": 95, "y": 51 }, 
      { "x": 95, "y": 51 }, 
      { "x": 96, "y": 67 }, 
      { "x": 99, "y": 113 }, 
      { "x": 97, "y": 165 }, 
      { "x": 95, "y": 202 }, 
      { "x": 95, "y": 231 }, 
      { "x": 95, "y": 241 }, 
      { "x": 95, "y": 246 }
    ],
    [
      { "x": 83, "y": 47 },
      { "x": 83, "y": 47 },
      { "x": 88, "y": 43 },
      { "x": 97, "y": 38 },
      { "x": 125, "y": 35 },
      { "x": 143, "y": 41 },
      { "x": 155, "y": 52 },
      { "x": 163, "y": 72 },
      { "x": 159, "y": 97 },
      { "x": 142, "y": 116 },
      { "x": 123, "y": 132 },
      { "x": 114, "y": 139 },
      { "x": 108, "y": 144 },
      { "x": 109, "y": 145 },
      { "x": 124, "y": 143 },
      { "x": 144, "y": 143 },
      { "x": 165, "y": 145 },
      { "x": 187, "y": 158 },
      { "x": 198, "y": 173 },
      { "x": 200, "y": 206 },
      { "x": 189, "y": 226 },
      { "x": 168, "y": 245 },
      { "x": 141, "y": 256 },
      { "x": 107, "y": 258 },
      { "x": 91, "y": 254 }
    ]
  ]
  },
  {
    letter: "c",
    coordinates: [
      [
        { "x": 182, "y": 137 },
        { "x": 182, "y": 137 },
        { "x": 177, "y": 132 },
        { "x": 168, "y": 124 },
        { "x": 141, "y": 127 },
        { "x": 130, "y": 140 },
        { "x": 121, "y": 165 },
        { "x": 120, "y": 203 },
        { "x": 129, "y": 219 },
        { "x": 147, "y": 233 },
        { "x": 173, "y": 228 },
        { "x": 185, "y": 217 },
        { "x": 189, "y": 210 }
      ]
    ]
  },
  {
    letter: "C",
    coordinates: [
      [
        { "x": 183, "y": 98 },
        { "x": 183, "y": 98 },
        { "x": 173, "y": 87 },
        { "x": 149, "y": 77 },
        { "x": 126, "y": 81 },
        { "x": 108, "y": 99 },
        { "x": 93, "y": 130 },
        { "x": 87, "y": 188 },
        { "x": 97, "y": 215 },
        { "x": 115, "y": 232 },
        { "x": 154, "y": 234 },
        { "x": 169, "y": 223 },
        { "x": 180, "y": 212 },
        { "x": 187, "y": 200 }
      ]
  ]
  },
  {
    letter: "d",
    coordinates: [
      [
        { "x": 201, "y": 28 },
        { "x": 201, "y": 28 },
        { "x": 201, "y": 41 },
        { "x": 202, "y": 85 },
        { "x": 203, "y": 129 },
        { "x": 204, "y": 170 },
        { "x": 203, "y": 202 },
        { "x": 203, "y": 219 },
        { "x": 202, "y": 225 },
        { "x": 201, "y": 229 },
        { "x": 199, "y": 215 },
        { "x": 190, "y": 180 },
        { "x": 179, "y": 157 },
        { "x": 165, "y": 137 },
        { "x": 144, "y": 127 },
        { "x": 119, "y": 131 },
        { "x": 105, "y": 143 },
        { "x": 93, "y": 177 },
        { "x": 93, "y": 206 },
        { "x": 101, "y": 219 },
        { "x": 116, "y": 232 },
        { "x": 135, "y": 239 },
        { "x": 173, "y": 240 },
        { "x": 190, "y": 235 },
        { "x": 199, "y": 230 },
        { "x": 203, "y": 229 }
      ]
    ]
  },
  {
    letter: "D",
    coordinates: [
      [
        { "x": 94, "y": 75 },
        { "x": 94, "y": 75 },
        { "x": 95, "y": 81 },
        { "x": 95, "y": 112 },
        { "x": 95, "y": 151 },
        { "x": 95, "y": 189 },
        { "x": 95, "y": 209 },
        { "x": 95, "y": 216 },
        { "x": 95, "y": 221 }
      ],
      [
        { "x": 94, "y": 73 },
        { "x": 94, "y": 73 },
        { "x": 100, "y": 73 },
        { "x": 123, "y": 74 },
        { "x": 156, "y": 79 },
        { "x": 169, "y": 88 },
        { "x": 189, "y": 105 },
        { "x": 200, "y": 127 },
        { "x": 207, "y": 155 },
        { "x": 205, "y": 179 },
        { "x": 196, "y": 199 },
        { "x": 177, "y": 215 },
        { "x": 170, "y": 220 },
        { "x": 159, "y": 225 },
        { "x": 139, "y": 229 },
        { "x": 125, "y": 231 },
        { "x": 103, "y": 231 },
        { "x": 96, "y": 229 },
        { "x": 90, "y": 227 },
        { "x": 86, "y": 227 }
      ]
    ],
  },
  {
    letter: "e",
    coordinates: [
      [
        { "x": 100, "y": 165 },
        { "x": 100, "y": 165 },
        { "x": 101, "y": 162 },
        { "x": 117, "y": 163 },
        { "x": 159, "y": 161 },
        { "x": 182, "y": 158 },
        { "x": 191, "y": 157 },
        { "x": 194, "y": 155 },
        { "x": 195, "y": 148 },
        { "x": 193, "y": 123 },
        { "x": 185, "y": 107 },
        { "x": 171, "y": 94 },
        { "x": 147, "y": 91 },
        { "x": 131, "y": 98 },
        { "x": 111, "y": 115 },
        { "x": 99, "y": 143 },
        { "x": 94, "y": 185 },
        { "x": 97, "y": 214 },
        { "x": 108, "y": 229 },
        { "x": 127, "y": 243 },
        { "x": 158, "y": 247 },
        { "x": 176, "y": 239 },
        { "x": 191, "y": 224 },
        { "x": 199, "y": 211 },
        { "x": 201, "y": 205 }
      ]
    ]
  },
  {
    letter: "E",
    coordinates: [
      [
        { "x": 179, "y": 61 },
        { "x": 179, "y": 61 },
        { "x": 165, "y": 60 },
        { "x": 117, "y": 63 },
        { "x": 103, "y": 63 },
        { "x": 101, "y": 65 },
        { "x": 99, "y": 90 },
        { "x": 103, "y": 140 },
        { "x": 105, "y": 207 },
        { "x": 108, "y": 238 },
        { "x": 110, "y": 245 },
        { "x": 111, "y": 248 },
        { "x": 141, "y": 247 },
        { "x": 178, "y": 244 },
        { "x": 196, "y": 244 },
        { "x": 200, "y": 245 }
      ],
      [
        { "x": 105, "y": 165 }, 
        { "x": 105, "y": 165 }, 
        { "x": 108, "y": 163 }, 
        { "x": 143, "y": 159 }, 
        { "x": 163, "y": 156 }
      ]
    ]
  },
  {
    letter: "f",
    coordinates: [
      [
        {"x": 203, "y": 68 },
        { "x": 203, "y": 68 },
        { "x": 202, "y": 63 },
        { "x": 196, "y": 53 },
        { "x": 185, "y": 43 },
        { "x": 174, "y": 38 },
        { "x": 161, "y": 39 },
        { "x": 150, "y": 47 },
        { "x": 141, "y": 67 },
        { "x": 137, "y": 109 },
        { "x": 138, "y": 140 },
        { "x": 141, "y": 171 },
        { "x": 141, "y": 209 },
        { "x": 141, "y": 227 }
      ],
      [
        { "x": 116, "y": 151 },
        { "x": 116, "y": 151 },
        { "x": 117, "y": 152 },
        { "x": 139, "y": 153 },
        { "x": 165, "y": 152 },
        { "x": 180, "y": 150 }
      ]
    ]
  },
  {
    letter: "F",
    coordinates: [
      [
        { "x": 201, "y": 53 }, 
        { "x": 201, "y": 53 }, 
        { "x": 185, "y": 54 }, 
        { "x": 162, "y": 58 }, 
        { "x": 136, "y": 61 }, 
        { "x": 129, "y": 62 }, 
        { "x": 127, "y": 66 }, 
        { "x": 127, "y": 90 }, 
        { "x": 130, "y": 134 }, 
        { "x": 133, "y": 183 }, 
        { "x": 133, "y": 220 }, 
        { "x": 133, "y": 234 }
      ],
      [
        { "x": 131, "y": 149 },
        { "x": 131, "y": 149 },
        { "x": 133, "y": 151 },
        { "x": 162, "y": 147 },
        { "x": 185, "y": 143 }
      ]
    ],
  },
  {
    letter: "g",
    coordinates: [
      [
        { "x": 175, "y": 81 },
        { "x": 175, "y": 81 },
        { "x": 172, "y": 78 },
        { "x": 153, "y": 72 },
        { "x": 131, "y": 71 },
        { "x": 117, "y": 77 },
        { "x": 102, "y": 91 },
        { "x": 95, "y": 123 },
        { "x": 98, "y": 140 },
        { "x": 107, "y": 152 },
        { "x": 121, "y": 163 },
        { "x": 141, "y": 169 },
        { "x": 159, "y": 165 },
        { "x": 171, "y": 155 },
        { "x": 181, "y": 139 },
        { "x": 187, "y": 118 },
        { "x": 185, "y": 95 },
        { "x": 178, "y": 85 },
        { "x": 171, "y": 79 }
      ],
      [
        { "x": 194, "y": 67 },
        { "x": 194, "y": 67 },
        { "x": 193, "y": 71 },
        { "x": 192, "y": 83 },
        { "x": 192, "y": 102 },
        { "x": 192, "y": 122 },
        { "x": 193, "y": 143 },
        { "x": 195, "y": 165 },
        { "x": 197, "y": 189 },
        { "x": 197, "y": 212 },
        { "x": 196, "y": 231 },
        { "x": 189, "y": 242 },
        { "x": 175, "y": 252 },
        { "x": 153, "y": 258 },
        { "x": 129, "y": 261 },
        { "x": 115, "y": 261 },
        { "x": 111, "y": 262 }
      ]
    ],
  },
  {
    letter: "G",
    coordinates: [
      [
        { "x": 201, "y": 94 },
        {"x": 201, "y": 94 },
        {"x": 197, "y": 93 },
        {"x": 185, "y": 86 },
        {"x": 159, "y": 81 },
        {"x": 137, "y": 83 },
        {"x": 121, "y": 89 },
        {"x": 105, "y": 101 },
        {"x": 90, "y": 121 },
        {"x": 80, "y": 154 },
        {"x": 79, "y": 181 },
        {"x": 84, "y": 200 },
        {"x": 93, "y": 219 },
        {"x": 111, "y": 237 },
        {"x": 131, "y": 248 },
        {"x": 159, "y": 252 },
        {"x": 175, "y": 249 },
        {"x": 191, "y": 240 },
        {"x": 203, "y": 225 },
        {"x": 211, "y": 207 },
        {"x": 219, "y": 181 },
        {"x": 220, "y": 171 },
        {"x": 219, "y": 169 },
        {"x": 207, "y": 171 },
        {"x": 164, "y": 175 },
        {"x": 152, "y": 176 }
      ]
    ],
  },
  {
    letter: "h",
    coordinates: [
      [
        { "x": 111, "y": 38 },
        { "x": 111, "y": 38 },
        { "x": 112, "y": 55 },
        { "x": 113, "y": 99 },
        { "x": 113, "y": 141 },
        { "x": 115, "y": 179 },
        { "x": 114, "y": 211 },
        { "x": 114, "y": 219 },
        { "x": 114, "y": 223 },
        { "x": 117, "y": 208 },
        { "x": 129, "y": 165 },
        { "x": 140, "y": 143 },
        { "x": 153, "y": 129 },
        { "x": 175, "y": 125 },
        { "x": 185, "y": 138 },
        { "x": 192, "y": 165 },
        { "x": 193, "y": 191 },
        { "x": 191, "y": 214 },
        { "x": 192, "y": 226 }
      ]
    ]
  },
  {
    letter: "H",
    coordinates: [
      [
        { "x": 113, "y": 60 },
        { "x": 113, "y": 60 },
        { "x": 113, "y": 95 },
        { "x": 117, "y": 147 },
        { "x": 121, "y": 197 },
        { "x": 121, "y": 218 },
        { "x": 122, "y": 227 }
      ],
      [
        { "x": 179, "y": 63 }, 
        { "x": 179, "y": 63 }, 
        { "x": 177, "y": 72 }, 
        { "x": 177, "y": 109 }, 
        { "x": 178, "y": 153 }, 
        { "x": 181, "y": 190 }, 
        { "x": 182, "y": 215 }, 
        { "x": 184, "y": 229 }
      ],
      [
        { "x": 109, "y": 158 },
        { "x": 109, "y": 158 },
        { "x": 114, "y": 156 },
        { "x": 142, "y": 156 },
        { "x": 173, "y": 154 },
        { "x": 182, "y": 153 }
      ]
    ],
  },
  {
    letter: "i",
    coordinates: [
      [{
        "x": 149, "y": 132
      }, {
        "x": 149, "y": 132
      }, {
        "x": 149, "y": 139
      }, {
        "x": 149, "y": 166
      }, {
        "x": 150, "y": 189
      }, {
        "x": 151, "y": 213
      }, {
        "x": 151, "y": 222
      }, {
        "x": 153, "y": 229
      }],
      [{
        "x": 151, "y": 89
      }, {
        "x": 151, "y": 89
      }, {
        "x": 149, "y": 91
      }]
    ],
  },
  {
    letter: "I",
    coordinates: [
      [
        { "x": 89, "y": 79 },
        { "x": 89, "y": 79 },
        { "x": 99, "y": 79 },
        { "x": 147, "y": 77 },
        { "x": 180, "y": 75 },
        { "x": 205, "y": 73 }
      ],
      [
        { "x": 84, "y": 244 },
        { "x": 84, "y": 244 },
        { "x": 88, "y": 242 },
        { "x": 105, "y": 241 },
        { "x": 138, "y": 241 },
        { "x": 167, "y": 240 },
        { "x": 189, "y": 241 },
        { "x": 211, "y": 240 },
        { "x": 220, "y": 241 }
      ],
      [
        { "x": 144, "y": 80 },
        { "x": 144, "y": 80 },
        { "x": 147, "y": 95 },
        { "x": 149, "y": 122 },
        { "x": 151, "y": 149 },
        { "x": 151, "y": 187 },
        { "x": 150, "y": 211 },
        { "x": 149, "y": 223 },
        { "x": 150, "y": 240 }
      ]
    ],
  },
  {
    letter: "j",
    coordinates: [
      [
        { "x": 157, "y": 83 },
        { "x": 157, "y": 83 },
        { "x": 156, "y": 103 },
        { "x": 158, "y": 137 },
        { "x": 161, "y": 178 },
        { "x": 164, "y": 213 },
        { "x": 165, "y": 245 },
        { "x": 157, "y": 262 },
        { "x": 140, "y": 275 },
        { "x": 101, "y": 265 },
        { "x": 83, "y": 242 }
      ],
      [
        { "x": 161, "y": 34 },
        { "x": 161, "y": 34 },
        { "x": 159, "y": 37 },
        { "x": 159, "y": 41 },
        { "x": 167, "y": 41 }
      ]
    ],
  },
  {
    letter: "J",
    coordinates: [
      [
        { "x": 161, "y": 53 },
        { "x": 161, "y": 53 },
        { "x": 157, "y": 65 },
        { "x": 158, "y": 95 },
        { "x": 161, "y": 140 },
        { "x": 161, "y": 177 },
        { "x": 162, "y": 211 },
        { "x": 155, "y": 236 },
        { "x": 143, "y": 249 },
        { "x": 112, "y": 255 },
        { "x": 81, "y": 228 },
        { "x": 70, "y": 203 }
      ],
      [
        { "x": 83, "y": 62 },
        { "x": 83, "y": 62 },
        { "x": 95, "y": 59 },
        { "x": 132, "y": 56 },
        { "x": 177, "y": 59 },
        { "x": 215, "y": 59 },
        { "x": 228, "y": 59 }
      ]
    ],
  },
  {
    letter: "k",
    coordinates: [
      [{
        "x": 119,
        "y": 83
      }, {
        "x": 119,
        "y": 83
      }, {
        "x": 119,
        "y": 119
      }, {
        "x": 115,
        "y": 181
      }, {
        "x": 118,
        "y": 221
      }],
      [{
        "x": 175,
        "y": 90
      }, {
        "x": 175,
        "y": 90
      }, {
        "x": 164,
        "y": 111
      }, {
        "x": 145,
        "y": 147
      }, {
        "x": 129,
        "y": 171
      }, {
        "x": 123,
        "y": 179
      }, {
        "x": 123,
        "y": 183
      }, {
        "x": 137,
        "y": 190
      }, {
        "x": 161,
        "y": 205
      }, {
        "x": 181,
        "y": 215
      }]
    ],
  },
  {
    letter: "K",
    coordinates: [
      [
        { "x": 123, "y": 52 },
        { "x": 123, "y": 52 },
        { "x": 121, "y": 72 },
        { "x": 121, "y": 118 },
        { "x": 120, "y": 169 },
        { "x": 119, "y": 211 },
        { "x": 118, "y": 236 }
      ],
      [
        { "x": 205, "y": 44 },
        { "x": 205, "y": 44 },
        { "x": 199, "y": 55 },
        { "x": 187, "y": 80 },
        { "x": 160, "y": 130 },
        { "x": 138, "y": 169 },
        { "x": 126, "y": 182 },
        { "x": 121, "y": 188 },
        { "x": 121, "y": 190 },
        { "x": 130, "y": 197 },
        { "x": 147, "y": 209 },
        { "x": 171, "y": 221 },
        { "x": 196, "y": 235 },
        { "x": 211, "y": 243 }
      ]
    ],
  },
  {
    letter: "l",
    coordinates: [
      [
        { "x": 149, "y": 57 },
        { "x": 149, "y": 57 },
        { "x": 149, "y": 68 },
        { "x": 149, "y": 110 },
        { "x": 149, "y": 174 },
        { "x": 147, "y": 209 },
        { "x": 147, "y": 221 }
      ]
    ],
  },
  {
    letter: "L",
    coordinates: [
      [
        { "x": 105, "y": 46 },
        { "x": 105, "y": 46 },
        { "x": 106, "y": 66 },
        { "x": 108, "y": 135 },
        { "x": 108, "y": 187 },
        { "x": 106, "y": 214 },
        { "x": 106, "y": 221 },
        { "x": 105, "y": 225 },
        { "x": 111, "y": 225 },
        { "x": 139, "y": 224 },
        { "x": 179, "y": 223 },
        { "x": 205, "y": 223 },
        {  "x": 213, "y": 223 }
      ]
    ],
  },
  {
    letter: "m",
    coordinates: [
      [
      { "x": 58, "y": 107 },
      { "x": 58, "y": 107 },
      { "x": 59, "y": 111 },
      { "x": 59, "y": 123 },
      { "x": 59, "y": 144 },
      { "x": 59, "y": 159 },
      { "x": 59, "y": 179 },
      { "x": 60, "y": 186 },
      { "x": 59, "y": 207 },
      { "x": 59, "y": 216 },
      { "x": 57, "y": 221 },
      { "x": 59, "y": 218 },
      { "x": 61, "y": 199 },
      { "x": 64, "y": 189 },
      { "x": 67, "y": 175 },
      { "x": 71, "y": 161 },
      { "x": 75, "y": 147 },
      { "x": 82, "y": 133 },
      { "x": 94, "y": 123 },
      { "x": 105, "y": 118 },
      { "x": 118, "y": 116 },
      { "x": 133, "y": 118 },
      { "x": 143, "y": 131 },
      { "x": 147, "y": 142 },
      { "x": 151, "y": 161 },
      { "x": 152, "y": 180 },
      { "x": 151, "y": 203 },
      { "x": 151, "y": 215 },
      { "x": 151, "y": 220 },
      { "x": 151, "y": 216 },
      { "x": 153, "y": 195 },
      { "x": 155, "y": 177 },
      { "x": 159, "y": 159 },
      { "x": 166, "y": 146 },
      { "x": 175, "y": 131 },
      { "x": 183, "y": 122 },
      { "x": 195, "y": 117 },
      { "x": 211, "y": 114 },
      { "x": 218, "y": 113 },
      { "x": 224, "y": 115 },
      { "x": 231, "y": 120 },
      { "x": 237, "y": 135 },
      { "x": 241, "y": 149 },
      { "x": 242, "y": 178 },
      { "x": 241, "y": 199 },
      { "x": 239, "y": 216 },
      { "x": 238, "y": 222 },
      { "x": 241, "y": 228 }
    ]
    ],
  },
  {
    letter: "M",
    coordinates: [
      [
        { "x": 87, "y": 235 },
        { "x": 87, "y": 235 },
        { "x": 86, "y": 230 },
        { "x": 84, "y": 211 },
        { "x": 84, "y": 161 },
        { "x": 87, "y": 119 },
        { "x": 87, "y": 89 },
        { "x": 87, "y": 84 },
        { "x": 89, "y": 83 },
        { "x": 101, "y": 92 },
        { "x": 115, "y": 109 },
        { "x": 134, "y": 134 },
        { "x": 143, "y": 146 },
        { "x": 148, "y": 152 },
        { "x": 149, "y": 155 },
        { "x": 151, "y": 154 },
        { "x": 157, "y": 150 },
        { "x": 173, "y": 131 },
        { "x": 190, "y": 111 },
        { "x": 205, "y": 94 },
        { "x": 213, "y": 86 },
        { "x": 217, "y": 83 },
        { "x": 220, "y": 91 },
        { "x": 223, "y": 120 },
        { "x": 225, "y": 158 },
        { "x": 227, "y": 191 },
        { "x": 227, "y": 218 },
        { "x": 226, "y": 245 },
        {  "x": 226, "y": 252 }
      ]
    ],
  },
  {
    letter: "n",
    coordinates: [
      [
        { "x": 94, "y": 115 },
        { "x": 94, "y": 115 },
        { "x": 94, "y": 123 },
        { "x": 102, "y": 170 },
        { "x": 105, "y": 206 },
        { "x": 107, "y": 216 },
        { "x": 107, "y": 211 },
        { "x": 109, "y": 178 },
        { "x": 112, "y": 147 },
        { "x": 118, "y": 124 },
        { "x": 138, "y": 103 },
        { "x": 150, "y": 97 },
        { "x": 173, "y": 105 },
        { "x": 183, "y": 119 },
        { "x": 190, "y": 138 },
        { "x": 196, "y": 177 },
        { "x": 200, "y": 208 },
        { "x": 205, "y": 219 }
      ]
    ],
  }, {
    letter: "N",
    coordinates: [
      [
        { "x": 100, "y": 233 },
        { "x": 100, "y": 233 },
        { "x": 99, "y": 229 },
        { "x": 99, "y": 225 },
        { "x": 99, "y": 199 },
        { "x": 97, "y": 165 },
        { "x": 97, "y": 125 },
        { "x": 95, "y": 99 },
        { "x": 95, "y": 89 },
        { "x": 98, "y": 90 },
        { "x": 109, "y": 109 },
        { "x": 127, "y": 133 },
        { "x": 145, "y": 162 },
        { "x": 165, "y": 189 },
        { "x": 179, "y": 209 },
        { "x": 192, "y": 224 },
        { "x": 201, "y": 233 },
        { "x": 204, "y": 228 },
        { "x": 205, "y": 205 },
        { "x": 204, "y": 165 },
        { "x": 204, "y": 117 },
        { "x": 203, "y": 85 }
      ]
    ],
  },
  {
    letter: "ñ",
    coordinates: [
      [
        { "x": 103, "y": 107 },
        { "x": 103, "y": 107 },
        { "x": 103, "y": 112 },
        { "x": 107, "y": 149 },
        { "x": 107, "y": 185 },
        { "x": 107, "y": 216 },
        { "x": 108, "y": 223 },
        { "x": 109, "y": 212 },
        { "x": 112, "y": 177 },
        { "x": 117, "y": 142 },
        { "x": 131, "y": 125 },
        { "x": 151, "y": 113 },
        { "x": 179, "y": 113 },
        { "x": 186, "y": 119 },
        { "x": 193, "y": 143 },
        { "x": 194, "y": 167 },
        { "x": 193, "y": 186 },
        { "x": 193, "y": 211 },
        { "x": 198, "y": 223 }
      ],
      [
        { "x": 116, "y": 82 },
        { "x": 116, "y": 82 },
        { "x": 114, "y": 79 },
        { "x": 119, "y": 71 },
        { "x": 129, "y": 67 },
        { "x": 141, "y": 69 },
        { "x": 151, "y": 73 },
        { "x": 167, "y": 76 },
        { "x": 182, "y": 73 },
        { "x": 196, "y": 57 }
      ]
    ],
  },
  {
    letter: "Ñ",
    coordinates: [
      [
        { "x": 105, "y": 223 },
        { "x": 105, "y": 223 },
        { "x": 105, "y": 203 },
        { "x": 106, "y": 153 },
        { "x": 105, "y": 113 },
        { "x": 104, "y": 92 },
        { "x": 107, "y": 90 },
        { "x": 118, "y": 110 },
        { "x": 136, "y": 135 },
        { "x": 161, "y": 168 },
        { "x": 178, "y": 191 },
        { "x": 193, "y": 208 },
        { "x": 203, "y": 217 },
        { "x": 207, "y": 216 },
        { "x": 207, "y": 178 },
        { "x": 205, "y": 135 },
        { "x": 203, "y": 108 },
        { "x": 202, "y": 87 }
      ],
      [
        { "x": 117, "y": 50 },
        { "x": 117, "y": 50 },
        { "x": 117, "y": 47 },
        { "x": 127, "y": 45 },
        { "x": 146, "y": 43 },
        { "x": 169, "y": 46 },
        { "x": 190, "y": 47 },
        { "x": 199, "y": 46 }
      ]
    ],
  },
  {
    letter: "o",
    coordinates: [
      [
        { "x": 150, "y": 117 },
        { "x": 150, "y": 117 },
        { "x": 138, "y": 118 },
        { "x": 122, "y": 131 },
        { "x": 109, "y": 153 },
        { "x": 105, "y": 197 },
        { "x": 119, "y": 215 },
        { "x": 137, "y": 223 },
        { "x": 166, "y": 222 },
        { "x": 187, "y": 197 },
        { "x": 193, "y": 165 },
        { "x": 187, "y": 143 },
        { "x": 171, "y": 128 },
        { "x": 139, "y": 118 }
      ]
    ],
  },
  {
    letter: "O",
    coordinates: [
      [
        { "x": 143, "y": 76 },
        { "x": 143, "y": 76 },
        { "x": 126, "y": 77 },
        { "x": 101, "y": 90 },
        { "x": 84, "y": 124 },
        { "x": 81, "y": 183 },
        { "x": 97, "y": 205 },
        { "x": 122, "y": 221 },
        { "x": 173, "y": 219 },
        { "x": 197, "y": 193 },
        { "x": 207, "y": 155 },
        { "x": 203, "y": 114 },
        { "x": 190, "y": 95 },
        { "x": 169, "y": 81 },
        { "x": 141, "y": 76 }
      ]
    ],
  },
  {
    letter: "p",
    coordinates: [
      [
        { "x": 107, "y": 115 },
        { "x": 107, "y": 115 },
        { "x": 108, "y": 138 },
        { "x": 111, "y": 182 },
        { "x": 113, "y": 229 },
        { "x": 113, "y": 255 },
        { "x": 113, "y": 270 }
      ],
      [
        { "x": 104, "y": 116 },
        { "x": 104, "y": 116 },
        { "x": 108, "y": 115 },
        { "x": 124, "y": 113 },
        { "x": 145, "y": 112 },
        { "x": 164, "y": 116 },
        { "x": 177, "y": 134 },
        { "x": 182, "y": 155 },
        { "x": 181, "y": 179 },
        { "x": 173, "y": 193 },
        { "x": 160, "y": 207 },
        { "x": 143, "y": 217 },
        { "x": 125, "y": 219 },
        { "x": 119, "y": 220 }
      ]
    ],

  },
  {
    letter: "P",
    coordinates: [
      [
        { "x": 96, "y": 42 },
        { "x": 96, "y": 42 },
        { "x": 99, "y": 67 },
        { "x": 107, "y": 122 },
        { "x": 111, "y": 175 },
        { "x": 113, "y": 211 },
        { "x": 113, "y": 221 }
      ],
      [
        { "x": 93, "y": 42 },
        { "x": 93, "y": 42 },
        { "x": 99, "y": 39 },
        { "x": 111, "y": 33 },
        { "x": 141, "y": 29 },
        { "x": 157, "y": 37 },
        { "x": 173, "y": 49 },
        { "x": 181, "y": 67 },
        { "x": 185, "y": 102 },
        { "x": 177, "y": 116 },
        { "x": 157, "y": 135 },
        { "x": 133, "y": 145 },
        { "x": 115, "y": 151 }
      ]
    ],
  },
  {
    letter: "q",
    coordinates: [
      [
        { "x": 191, "y": 89 },
        { "x": 191, "y": 89 },
        { "x": 186, "y": 85 },
        { "x": 173, "y": 80 },
        { "x": 145, "y": 77 },
        { "x": 120, "y": 82 },
        { "x": 101, "y": 106 },
        { "x": 97, "y": 141 },
        { "x": 105, "y": 159 },
        { "x": 121, "y": 172 },
        { "x": 149, "y": 174 },
        { "x": 167, "y": 159 },
        { "x": 181, "y": 138 },
        { "x": 189, "y": 115 },
        { "x": 195, "y": 96 },
        { "x": 197, "y": 89 },
        { "x": 197, "y": 119 },
        { "x": 197, "y": 175 },
        { "x": 197, "y": 219 },
        { "x": 197, "y": 251 },
        { "x": 199, "y": 257 }
      ]
    ],
  },
  {
    letter: "Q",
    coordinates: [
      [ 
        {"x": 163, "y": 46 },
        {"x": 163, "y": 46 },
        {"x": 153, "y": 47 },
        {"x": 134, "y": 56 },
        {"x": 117, "y": 75 },
        {"x": 99, "y": 112 },
        {"x": 94, "y": 167 },
        {"x": 102, "y": 190 },
        {"x": 115, "y": 211 },
        {"x": 137, "y": 229 },
        {"x": 178, "y": 226 },
        {"x": 196, "y": 218 },
        {"x": 213, "y": 191 },
        {"x": 221, "y": 147 },
        {"x": 221, "y": 114 },
        {"x": 212, "y": 89 },
        {"x": 199, "y": 72 },
        {"x": 182, "y": 57 },
        {"x": 157, "y": 49 }
      ],
      [
        { "x": 167, "y": 188 },
        { "x": 167, "y": 188 },
        { "x": 177, "y": 199 },
        { "x": 199, "y": 215 },
        { "x": 219, "y": 232 },
        { "x": 231, "y": 240
        }
      ]
    ]
  },
  {
    letter: "r",
    coordinates: [
      [
        { "x": 116, "y": 101 },
        { "x": 116, "y": 101 },
        { "x": 115, "y": 105 },
        { "x": 117, "y": 129 },
        { "x": 120, "y": 163 },
        { "x": 121, "y": 189 },
        { "x": 123, "y": 212 },
        { "x": 123, "y": 218 },
        { "x": 123, "y": 220 },
        { "x": 122, "y": 203 },
        { "x": 124, "y": 166 },
        { "x": 131, "y": 139 },
        { "x": 141, "y": 119 },
        { "x": 156, "y": 99 },
        { "x": 177, "y": 93 },
        { "x": 186, "y": 96 }
      ]
    ],
  },
  {
    letter: "R",
    coordinates: [
      [
        {"x": 80, "y": 45 },
        { "x": 80, "y": 45 },
        { "x": 87, "y": 70 },
        { "x": 103, "y": 120 },
        { "x": 115, "y": 203 },
        { "x": 116, "y": 237 },
        { "x": 115, "y": 230 },
        { "x": 113, "y": 142 },
        { "x": 127, "y": 75 },
        { "x": 149, "y": 45 },
        { "x": 185, "y": 49 },
        { "x": 184, "y": 123 },
        { "x": 141, "y": 196 },
        { "x": 117, "y": 214 },
        { "x": 113, "y": 203 },
        { "x": 159, "y": 227 },
        { "x": 246, "y": 227 }
      ]
    ],
  },
  {
    letter: "s",
    coordinates: [
      [
        { "x": 167, "y": 117},
        { "x": 167, "y": 117},
        { "x": 159, "y": 111},
        { "x": 143, "y": 109},
        { "x": 135, "y": 113},
        { "x": 128, "y": 135},
        { "x": 128, "y": 149},
        { "x": 139, "y": 161},
        { "x": 156, "y": 168},
        { "x": 169, "y": 175},
        { "x": 179, "y": 193},
        { "x": 175, "y": 217},
        { "x": 161, "y": 228},
        { "x": 122, "y": 223},
        { "x": 112, "y": 201}]
    ],
  },
  {
    letter: "S",
    coordinates: [
      [
        { "x": 197, "y": 43 },
        { "x": 197, "y": 43 },
        { "x": 185, "y": 39 },
        { "x": 145, "y": 36 },
        { "x": 118, "y": 45 },
        { "x": 97, "y": 74 },
        { "x": 100, "y": 112 },
        { "x": 133, "y": 123 },
        { "x": 183, "y": 125 },
        { "x": 206, "y": 135 },
        { "x": 221, "y": 162 },
        { "x": 219, "y": 215 },
        { "x": 171, "y": 248 },
        { "x": 105, "y": 232 },
        { "x": 81, "y": 220 }
      ]
    ],
  },
  {
    letter: "t",
    coordinates: [
      [
        { "x": 136, "y": 73 },
        { "x": 136, "y": 73 },
        { "x": 139, "y": 77 },
        { "x": 147, "y": 105 },
        { "x": 149, "y": 149 },
        { "x": 149, "y": 184 },
        { "x": 149, "y": 211 },
        { "x": 153, "y": 233 },
        { "x": 171, "y": 245 },
        { "x": 189, "y": 245 },
        { "x": 197, "y": 241 }
      ],
      [
        { "x": 109, "y": 153 },
        { "x": 109, "y": 153 },
        { "x": 160, "y": 151 },
        { "x": 205, "y": 149 }
      ]
    ],
  },
  {
    letter: "T",
    coordinates: [
      [
        { "x": 81, "y": 81 },
        { "x": 81, "y": 81 },
        { "x": 87, "y": 81 },
        { "x": 137, "y": 81 },
        { "x": 187, "y": 81 },
        { "x": 209, "y": 81 },
        { "x": 215, "y": 81 }
      ],
      [
        { "x": 149, "y": 83 },
        { "x": 149, "y": 83 },
        { "x": 149, "y": 97 },
        { "x": 149, "y": 131 },
        { "x": 151, "y": 174 },
        { "x": 151, "y": 205 },
        { "x": 151, "y": 222 }
      ]
    ],
  },
  {
    letter: "u",
    coordinates: [
      [
        { "x": 109, "y": 115 },
        { "x": 109, "y": 115 },
        { "x": 109, "y": 121 },
        { "x": 111, "y": 149 },
        { "x": 113, "y": 189 },
        { "x": 117, "y": 210 },
        { "x": 129, "y": 222 },
        { "x": 150, "y": 229 },
        { "x": 177, "y": 219 },
        { "x": 191, "y": 194 },
        { "x": 197, "y": 153 },
        { "x": 199, "y": 129 },
        { "x": 199, "y": 122 },
        { "x": 199, "y": 121 },
        { "x": 201, "y": 133 },
        { "x": 203, "y": 158 },
        { "x": 207, "y": 187 },
        { "x": 213, "y": 213 },
        { "x": 217, "y": 223 },
        { "x": 219, "y": 228
        }
      ]
    ],
  },
  {
    letter: "U",
    coordinates: [
      [
        { "x": 93, "y": 58 },
        { "x": 93, "y": 58 },
        { "x": 95, "y": 63 },
        { "x": 97, "y": 83 },
        { "x": 102, "y": 131 },
        { "x": 107, "y": 165 },
        { "x": 113, "y": 192 },
        { "x": 123, "y": 209 },
        { "x": 141, "y": 223 },
        { "x": 169, "y": 228 },
        { "x": 194, "y": 215 },
        { "x": 207, "y": 186 },
        { "x": 206, "y": 125 },
        { "x": 200, "y": 81 },
        { "x": 199, "y": 63 }
      ]
    ],
  },
  {
    letter: "v",
    coordinates: [
      [
        { "x": 97, "y": 93 },
        { "x": 97, "y": 93 },
        {  "x": 105, "y": 111 },
        { "x": 121, "y": 147 },
        { "x": 139, "y": 187 },
        { "x": 145, "y": 207 },
        { "x": 150, "y": 217 },
        { "x": 153, "y": 217 },
        { "x": 162, "y": 189 },
        { "x": 171, "y": 163 },
        { "x": 183, "y": 131 },
        { "x": 194, "y": 103 },
        {  "x": 203, "y": 85 }
      ]
    ],
  },
  {
    letter: "V",
    coordinates: [
      [
        { "x": 87, "y": 57 },
        { "x": 87, "y": 57 },
        { "x": 94, "y": 71 },
        { "x": 105, "y": 96 },
        { "x": 123, "y": 145 },
        { "x": 138, "y": 183 },
        { "x": 146, "y": 211 },
        { "x": 149, "y": 221 },
        { "x": 151, "y": 223 },
        { "x": 161, "y": 201 },
        { "x": 173, "y": 171 },
        { "x": 189, "y": 122 },
        { "x": 202, "y": 88 },
        { "x": 211, "y": 63 },
        { "x": 216, "y": 49 },
        { "x": 219, "y": 43 }
      ]
    ],
  },
  {
    letter: "w",
    coordinates: [
      [
        { "x": 73, "y": 120 },
        { "x": 73, "y": 120 },
        { "x": 77, "y": 132 },
        { "x": 87, "y": 155 },
        { "x": 99, "y": 182 },
        { "x": 107, "y": 203 },
        { "x": 111, "y": 214 },
        { "x": 113, "y": 216 },
        { "x": 119, "y": 201 },
        { "x": 130, "y": 178 },
        { "x": 138, "y": 159 },
        { "x": 143, "y": 150 },
        { "x": 145, "y": 149 },
        { "x": 149, "y": 156 },
        { "x": 161, "y": 174 },
        { "x": 173, "y": 194 },
        { "x": 180, "y": 207 },
        { "x": 183, "y": 214 },
        { "x": 185, "y": 215 },
        { "x": 192, "y": 193 },
        { "x": 205, "y": 165 },
        { "x": 215, "y": 142 },
        { "x": 221, "y": 125 },
        { "x": 225, "y": 116
        }
      ]
    ],
  },
  {
    letter: "W", 
    coordinates: [
      [
        { "x": 29, "y": 69 },
        { "x": 29, "y": 69 },
        { "x": 43, "y": 89 },
        { "x": 68, "y": 137 },
        { "x": 94, "y": 187 },
        { "x": 105, "y": 211 },
        { "x": 111, "y": 221 },
        { "x": 120, "y": 193 },
        { "x": 129, "y": 163 },
        { "x": 139, "y": 131 },
        { "x": 145, "y": 117 },
        { "x": 152, "y": 125 },
        { "x": 169, "y": 159 },
        { "x": 179, "y": 185 },
        { "x": 189, "y": 209 },
        { "x": 196, "y": 217 },
        { "x": 209, "y": 191 },
        { "x": 225, "y": 141 },
        { "x": 244, "y": 80 },
        { "x": 253, "y": 51 }
      ]
    ],
  },
  {
    letter: "x",
    coordinates: [
      [
        { "x": 111, "y": 107 },
        { "x": 111, "y": 107 },
        { "x": 115, "y": 114 },
        { "x": 137, "y": 145 },
        { "x": 167, "y": 184 },
        { "x": 185, "y": 206 },
        { "x": 199, "y": 222
        }
      ],
      [
        { "x": 200, "y": 95 },
        { "x": 200, "y": 95 },
        { "x": 195, "y": 103 },
        { "x": 181, "y": 127 },
        { "x": 159, "y": 164 },
        { "x": 136, "y": 201 },
        { "x": 118, "y": 232 }
      ]
    ],
  },
  {
    letter: "X",
    coordinates: [
      [
        { "x": 208, "y": 41 },
        { "x": 208, "y": 41 },
        { "x": 176, "y": 99 },
        { "x": 122, "y": 201 },
        { "x": 96, "y": 245 }
      ],
      [
        { "x": 95, "y": 47 },
        { "x": 95, "y": 47 },
        { "x": 114, "y": 81 },
        { "x": 173, "y": 164 },
        { "x": 226, "y": 240
        }
      ]
    ],
  },
  {
    letter: "y",
    coordinates: [
      [
        { "x": 111, "y": 83 },
        { "x": 111, "y": 83 },
        { "x": 110, "y": 115 },
        { "x": 115, "y": 155 },
        { "x": 129, "y": 173 },
        { "x": 157, "y": 180 },
        { "x": 179, "y": 155 },
        { "x": 188, "y": 131 },
        { "x": 191, "y": 93 },
        { "x": 191, "y": 87 },
        { "x": 193, "y": 96 },
        { "x": 197, "y": 127 },
        { "x": 205, "y": 168 },
        { "x": 212, "y": 215 },
        { "x": 207, "y": 252 },
        { "x": 172, "y": 277 },
        { "x": 119, "y": 263 },
        { "x": 114, "y": 219
        }
      ]
    ],
  },
  {
    letter: "Y",
    coordinates: [
      [
        { "x": 93, "y": 46 },
        { "x": 93, "y": 46 },
        { "x": 92, "y": 52 },
        { "x": 91, "y": 73 },
        { "x": 97, "y": 99 },
        { "x": 107, "y": 121 },
        { "x": 123, "y": 139 },
        { "x": 143, "y": 148 },
        { "x": 174, "y": 147 },
        { "x": 188, "y": 132 },
        { "x": 198, "y": 111 },
        { "x": 199, "y": 68 },
        { "x": 191, "y": 45 }
      ],
      [
        { "x": 159, "y": 150 },
        { "x": 159, "y": 150 },
        { "x": 157, "y": 153 },
        { "x": 157, "y": 176 },
        { "x": 158, "y": 192 },
        { "x": 157, "y": 213 },
        { "x": 157, "y": 232
        }
      ]
    ],
  },
  {
    letter: "z",
    coordinates: [
      [
        { "x": 113, "y": 125 },
        { "x": 113, "y": 125 },
        { "x": 114, "y": 123 },
        { "x": 135, "y": 123 },
        { "x": 165, "y": 122 },
        { "x": 181, "y": 122 },
        { "x": 187, "y": 122 },
        { "x": 187, "y": 127 },
        { "x": 178, "y": 144 },
        { "x": 161, "y": 167 },
        { "x": 128, "y": 203 },
        { "x": 118, "y": 214 },
        { "x": 111, "y": 221 },
        { "x": 108, "y": 225 },
        { "x": 112, "y": 224 },
        { "x": 133, "y": 225 },
        { "x": 165, "y": 223 },
        { "x": 189, "y": 223 },
        { "x": 197, "y": 223 }
      ]
    ],
  },
  {
    letter: "Z",
    coordinates: [
      [
        { "x": 95, "y": 74 },
        { "x": 95, "y": 74 },
        { "x": 102, "y": 75 },
        { "x": 136, "y": 75 },
        { "x": 162, "y": 75 },
        { "x": 181, "y": 73 },
        { "x": 189, "y": 74 },
        { "x": 193, "y": 75 },
        { "x": 190, "y": 77 },
        { "x": 182, "y": 90 },
        { "x": 166, "y": 113 },
        { "x": 145, "y": 142 },
        { "x": 124, "y": 171 },
        { "x": 107, "y": 196 },
        { "x": 90, "y": 215 },
        { "x": 85, "y": 220 },
        { "x": 87, "y": 222 },
        { "x": 101, "y": 223 },
        { "x": 135, "y": 223 },
        { "x": 170, "y": 222 },
        { "x": 196, "y": 221 },
        { "x": 207, "y": 223 }
      ]
    ],
  }
]