
// Display list of all Polls.
exports.pool_list = (req, res) => {
// exports.pool_list = (req, res, next) => {
  // TODO: Need to fetch and show list of a pools for users

  // Course.find({}, function(err, courses){
  //   if (err) {
  //     console.log(err);
  //   } else {
  //     res.render('courses/index', {
  //       user: req.user,
  //       courses: courses
  //     });
  //   }
  // });
  console.log('pools hello');
  res.render('pools/index', {
    user: req.user,
  });
};

// Display detail page for a specific Pool.
exports.pool_detail = () => {
// exports.pool_detail = (req, res, next) => {
  // TODO: Need to fetch and show detail of a pool


  // Course.findById(req.params.id, function(err, course){
  //   if (course) {
  //     res.render('courses/show', {
  //       user: req.user,
  //       course: course,
  //       chapters: course.chapters
  //     });
  //   } else {
  //     // next(createError.NotFound());
  //   }
  // });
};

// Display Pool create form on GET.
exports.pool_create_get = (req, res) => {
// exports.pool_create_get = (req, res, next) => {
  // TODO: Need to show form to create a contract

  console.log('hello');
  res.render('pools/new', {
    user: req.user,
  });
};

// Create and deploy a new pool.
exports.pool_create_post = () => {
// exports.pool_create_post = (req, res, next) => {
  // TODO: Need to deploy a contract here

  // let course = new Course();
  // course.name = req.body.name;
  // course.description = req.body.description;
  // course.save(function(err){
  //   if(err){
  //     console.log(err);
  //     return;
  //   } else {
  //     res.redirect('/polls')
  //   };
  // });
};
