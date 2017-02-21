import faker from 'faker'

export default class Article {

  static getArticles(num = 4) {
    var articles = [];

    for(let i = 0; i < num; i++) {
      articles.push({
        id: faker.random.uuid(),
        title: faker.lorem.sentence(),
        body: faker.lorem.paragraphs(20),
        author: {
          name: faker.name.findName(),
          bio: faker.name.title(),
          avatar: faker.internet.avatar()
        }
      })
    }
    return articles
  }

  getArticle(id) {
    
  }

}