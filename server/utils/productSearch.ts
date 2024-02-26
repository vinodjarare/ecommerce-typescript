class ApiFeatures {
    public query: any;
    public queryStr: any;
  
    constructor(query: any, queryStr: any) {
      this.query = query;
      this.queryStr = queryStr;
    }
  
    search() {
      const keyword: any = this.queryStr.keyword
        ? {
            name: {
              $regex: this.queryStr.keyword,
              $options: "i",
            },
          }
        : {};
  
      this.query = this.query.find({ ...keyword });
      return this;
    }
  
    filter() {
      const queryCopy: any = { ...this.queryStr };
      // Removing some fields for category
      const removeFields: string[] = ["keyword", "page", "limit"];
  
      removeFields.forEach((key) => delete queryCopy[key]);
  
      // Filter For Price and Rating
  
      let queryStr: string = JSON.stringify(queryCopy);
      queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);
  
      this.query = this.query.find(JSON.parse(queryStr));
  
      return this;
    }
  
    pagination(resultPerPage: number) {
      const currentPage: number = Number(this.queryStr.page) || 1;
  
      const skip: number = resultPerPage * (currentPage - 1);
  
      this.query = this.query.limit(resultPerPage).skip(skip);
  
      return this;
    }
  }
  
  export default ApiFeatures;
  