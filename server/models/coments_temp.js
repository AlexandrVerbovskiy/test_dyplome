/*
// Абстракція "Коментар"
class Comment {
    constructor(storage) {
      this.storage = storage;
    }
  
    async create(commentData) {
      return await this.storage.create(commentData);
    }
  
    async getById(commentId) {
      return await this.storage.getById(commentId);
    }
  }
  
  // Реалізація "Коментар" для виконавця
  class ExecutorCommentStorage extends Model{
    async create(commentData) {
      const insertRes = await this.db.query(
        "INSERT INTO executor_comments (author_id, executor_id, description, rating) VALUES (?, ?, ?, ?)",
        [commentData.authorId, commentData.executorId, commentData.description, commentData.rating]
      );
  
      const commentId = insertRes.insertId;
      const comment = await this.getById(commentId);
      return comment;
    }
  
    async getById(commentId) {
      const comment = await this.db.query(
        "SELECT * FROM executor_comments WHERE id = ?",
        [commentId]
      );
  
      if (comment.length > 0) return comment[0];
      return null;
    }
  }
  
  // Реалізація "Коментар" для продавця
  class SellerCommentStorage extends Model {
    async create(commentData) {
      const insertRes = await this.db.query(
        "INSERT INTO seller_comments (author_id, seller_id, description, rating) VALUES (?, ?, ?, ?)",
        [commentData.authorId, commentData.sellerId, commentData.description, commentData.rating]
      );
  
      const commentId = insertRes.insertId;
      const comment = await this.getById(commentId);
      return comment;
    }
  
    async getById(commentId) {
      const comment = await this.db.query(
        "SELECT * FROM seller_comments WHERE id = ?",
        [commentId]
      );
  
      if (comment.length > 0) return comment[0];
      return null;
    }
  }
  
  // Реалізація "Коментар" для пропозиції
  class ProposalCommentStorage extends Model{
    async create(commentData) {
      const insertRes = await this.db.query(
        "INSERT INTO proposal_comments (author_id, proposal_id, rating) VALUES (?, ?, ?)",
        [commentData.authorId, commentData.proposalId, commentData.rating]
      );
  
      const commentId = insertRes.insertId;
      const comment = await this.getById(commentId);
      return comment;
    }
  
    async getById(commentId) {
      const comment = await this.db.query(
        "SELECT * FROM proposal_comments WHERE id = ?",
        [commentId]
      );
  
      if (comment.length > 0) return comment[0];
      return null;
    }
  }
  
  // Реалізація "Коментар" для відповіді
  class ReplyCommentStorage extends Model{
    async create(commentData) {
      const insertRes = await this.db.query(
        "INSERT INTO reply_comments (parent_comment_id, text, respondent_id, comment_type) VALUES (?, ?, ?, ?)",
        [commentData.parentCommentId, commentData.text, commentData.respondentId, commentData.commentType]
      );
  
      const commentId = insertRes.insertId;
      const comment = await this.getById(commentId);
      return comment;
    }
  
    async getById(commentId) {
      const comment = await this.db.query(
        "SELECT * FROM reply_comments WHERE id = ?",
        [commentId]
      );
  
      if (comment.length > 0) return comment[0];
      return null;
    }
  }
  
  // приймає об'єкт бази даних, який має метод query
  async function init(db){
  // Приклад використання
  const executorCommentStorage = new ExecutorCommentStorage(db);
  const sellerCommentStorage = new SellerCommentStorage(db);
  const proposalCommentStorage = new ProposalCommentStorage(db);
  const replyCommentStorage = new ReplyCommentStorage(db);
  
  const executorComment = new Comment(executorCommentStorage);
  const sellerComment = new Comment(sellerCommentStorage);
  const proposalComment = new Comment(proposalCommentStorage);
  const replyComment = new Comment(replyCommentStorage);
  
  // Створення коментарів різних типів
  console.log(await executorComment.create({ authorId: 1, executorId: 2, description: 'Great job!', rating: 5 }));
  
  console.log(await sellerComment.create({ authorId: 1, sellerId: 3, description: 'Excellent service!', rating: 4 }));
  
  console.log(await proposalComment.create({ authorId: 1, proposalId: 4, rating: 3 }));
  
  console.log(await replyComment.create({ parentCommentId: 1, text: 'Thank you!', respondentId: 2, commentType: 'executor' }));
  }*/