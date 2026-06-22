// 非遗文创设计类书籍资源数据

export const bookCategories = [
  { id: 'design', name: '文创设计方法', displayName: '文创设计' },
  { id: 'craft', name: '传统手工技艺', displayName: '传统手工' },
  { id: 'typography', name: '汉字设计与排版', displayName: '汉字设计' },
  { id: 'folk', name: '民间美术与图案', displayName: '民间美术' },
  { id: 'culture', name: '民俗文化与艺术', displayName: '民俗文化' },
];

export const bookResources = {
  // 文创设计方法类
  design: [
    {
      name: '手工开悟：非遗与文创设计',
      url: 'https://book.douban.com/subject/36128138/',
      description: '本书系统论述了非物质文化遗产与文创设计的融合。内容涵盖非遗文创的概念、现状、存在问题，并提出了五条核心设计原则和六种具体方法，对行业发展有指导意义。',
      cover: 'assets/books/01-ShouGongKaiWu-Feiyi-cover.jpg',
      tags: ['非遗设计', '方法论', '理论指导'],
    },
    {
      name: '新时代文创产品设计',
      url: 'https://book.douban.com/subject/36391278/',
      description: '本书聚焦博物馆文创产品设计，从概念、价值、趋势、策略到未来探索进行系统阐述。它结合产业链思维分析实际问题，探讨了IP设计、盲盒、元宇宙等新趋势，兼顾理论与方法。',
      cover: 'assets/books/02-NewEraProductDesign-cover.jpg',
      tags: ['博物馆文创', 'IP设计', '产业思维'],
    },
    {
      name: '文创地图：文化创意产业的经营地图',
      url: 'https://book.douban.com/subject/34928944/',
      description: '本书以诚品书店等案例，探讨文创产业的经营逻辑。核心观点是，经营需提高"记忆占有率"和"偏爱占有率"，通过空间、商品和活动创造独特体验，连接顾客情感。',
      cover: 'assets/books/03-WenChuanMap-cover.jpg',
      tags: ['经营策略', '品牌塑造', '案例分析'],
    },
    {
      name: '书艺问道：吕敬人书籍设计说',
      url: 'https://book.douban.com/subject/27178127/',
      description: '本书由著名书籍设计师吕敬人撰写，阐述了他的书籍设计理念与实践。内容涵盖对书籍形态、编辑设计、时空艺术及"书戏"概念的思考，是书籍设计领域的经典著作。',
      cover: 'assets/books/15-ShuYiWenDao-cover.jpg',
      tags: ['书籍设计', '设计大师', '理念实践'],
    },
  ],

  // 传统手工技艺类
  craft: [
    {
      name: '可爱手艺：和孩子一起学做100种中国古风手作',
      url: 'https://book.douban.com/subject/36280141/',
      description: '这是一套亲子美育游戏书，介绍绘画、编织、剪刻等九大类100种古风手作。书中用易得材料简化传统工艺，并融入相关诗词文段，旨在让孩子体验传统手工艺的精妙。',
      cover: 'assets/books/04-Cute Craft Art-Make 100 Chinese Traditional Craft Art with Children-cover.jpg',
      tags: ['亲子美育', '古风手作', '传统工艺'],
    },
    {
      name: '华夏手工：图解传统手工制作',
      url: 'https://product.dangdang.com/29856146.html',
      description: '本书图文并茂地展示了五大类传统手工，包括华彩霓裳（缂丝、刺绣）、饰物风华（绢花、绒花）、掌上风艺（灯笼、捏面人）、文房雅事和佳肴美馔，介绍其工艺与技法。',
      cover: 'assets/books/05-Chinese Traditional Craft Art-cover.jpg',
      tags: ['图解教程', '传统工艺', '技法展示'],
    },
    {
      name: '趣玩：中国传统益智游戏',
      url: 'https://book.douban.com/subject/35406181/',
      description: '本书搜集并介绍了七巧板、华容道、九连环、鲁班锁等中国传统益智游戏。它不仅讲解玩法与解法，更探寻这些游戏背后的数学原理、历史渊源与文化趣味。',
      cover: 'assets/books/17-QuWan-Traditional Chinese Games-cover.jpg',
      tags: ['益智游戏', '传统智慧', '文化趣味'],
    },
  ],

  // 汉字设计与排版类
  typography: [
    {
      name: '中国汉字设计史',
      url: 'https://book.douban.com/subject/35570323/',
      description: '本书从设计学的视角，系统梳理了汉字从甲骨文到现代数字化字体的演变历程，分析其造型、结构及在不同媒介中的应用，揭示了汉字设计中蕴含的美学与智慧。',
      cover: 'assets/books/06-The History of Chinese Character Design-cover.jpg',
      tags: ['汉字演变', '设计史学', '字体美学'],
    },
    {
      name: '上海字记',
      url: 'https://book.douban.com/subject/30136454/',
      description: '本书汇集了上海自晚清至现代的海量汉字设计实物，如招牌、广告、票据等，以视觉档案的形式，呈现了上海城市生活中汉字应用的百年变迁与设计风貌。',
      cover: 'assets/books/07-Shanghai Type Design-cover.jpg',
      tags: ['城市字体', '视觉档案', '百年变迁'],
    },
    {
      name: '旧物观察：中国早期商业设计中的文字造型与编排',
      url: 'https://book.douban.com/subject/36951880/',
      description: '本书聚焦于中国近代商业物品（如包装、商标）上的文字设计，通过对旧物的细致观察，分析其文字造型、版式编排的特点，展现早期商业美术中的视觉文化。',
      cover: 'assets/books/08-Early Chinese Business Type Design-cover.jpg',
      tags: ['商业设计', '版式编排', '视觉文化'],
    },
  ],

  // 民间美术与图案类
  folk: [
    {
      name: '中国民间美术全集（丛书）',
      url: 'https://book.douban.com/series/22954',
      description: '这是一套系统收录中国各地区、各民族民间美术作品的大型丛书。内容涵盖剪纸、年画、皮影、刺绣、泥塑、面具等多种门类，是了解中国民间艺术宝库的重要资料。',
      cover: 'assets/books/09-The Collection of Chinese Folk Art-cover.jpg',
      tags: ['民间美术', '大型丛书', '艺术宝库'],
    },
    {
      name: '纹饰集：中国古代器物图案之美',
      url: 'https://book.douban.com/subject/37056161/',
      description: '本书收集并解读中国古代器物（如青铜器、陶瓷、织绣）上的经典纹饰，分析其造型规律、文化寓意及美学价值，为现代设计提供丰富的传统图案资源。',
      cover: 'assets/books/10-Chinese Traditional Pattern Design-cover.jpg',
      tags: ['传统纹饰', '器物图案', '设计资源'],
    },
    {
      name: '古版年画丛谭',
      url: 'https://product.dangdang.com/12333343360.html',
      description: '本书以"丛谭"形式，探讨中国古版年画的历史渊源、地域风格（如天津杨柳青、苏州桃花坞）、制作工艺、题材内容及其反映的民间信仰与生活观念。',
      cover: 'assets/books/11-GuBanNianHuaCongTan-cover.jpg',
      tags: ['年画艺术', '地域风格', '民间信仰'],
    },
    {
      name: '花间世界：库淑兰作品研究集',
      url: 'https://book.douban.com/subject/36794642/',
      description: '本书聚焦中国民间剪纸艺术家、"剪花娘子"库淑兰的传奇人生与艺术创作。她的作品色彩绚丽、构图饱满、充满生命想象力，本书对其艺术风格与价值进行了深入研究。',
      cover: 'assets/books/16-HuaJianShiJie-KuShulan-cover.jpg',
      tags: ['剪纸', '艺术家', '民间'],
    },
  ],

  // 民俗文化与艺术类
  culture: [
    {
      name: '中国镇物（插图本）',
      url: 'https://book.douban.com/subject/36139386/',
      description: '"镇物"指用于辟邪、禳灾的民俗物品。本书系统研究了中国镇物的文化内涵、主要类型（如石敢当、太极图、符咒）及其在民间信仰中的功能，配有丰富插图。',
      cover: 'assets/books/12-The Illustration of Chinese ZhenWu-cover.jpg',
      tags: ['民俗研究', '辟邪文化', '图文并茂'],
    },
    {
      name: '中国祥物（插图本）',
      url: 'https://book.douban.com/subject/36143229/',
      description: '与"镇物"相对，"祥物"指象征吉祥的物件或图案，如如意、寿桃、喜鹊登梅等。本书阐释了祥物的起源、演变及其中寄托的祈福迎祥的民俗心理。',
      cover: 'assets/books/13-The Illustration of Chinese XiangWu-cover.jpg',
      tags: ['吉祥文化', '民俗符号', '祈福迎祥'],
    },
    {
      name: '折纸针线包：鲜为人知的中国民间艺术',
      url: 'https://book.douban.com/subject/35611028/',
      description: '本书介绍了一种独特的中国民间手工艺——折纸针线包。它通常用布或纸折叠成精巧的小容器，用于存放针线，兼具实用性与装饰性，体现了民间的巧思与审美。',
      cover: 'assets/books/14-Paper Folding-Unknown Chinese Folk Art-cover.jpg',
      tags: ['民间工艺', '实用美学', '巧思创意'],
    },
  ],
};


