let testCont = {};

testCont.triggerError = async (req, res, next) => {
    next({
      status: 500,
      message: "Wow! Looks like Brother Robertson broke the site."})
}

module.exports = testCont;