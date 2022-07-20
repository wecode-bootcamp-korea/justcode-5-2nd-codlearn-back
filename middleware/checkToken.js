const async checkTokens(req, res, next) {
    if (req.cookies.access === undefined) {
      const error = new Error('NOT_A')
    }
}