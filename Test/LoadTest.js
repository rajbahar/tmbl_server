const loadtest = require('loadtest');
const options = {
    url: 'http://tatalb-656815788.ap-south-1.elb.amazonaws.com/api/login',
    maxRequests: 50000,
    concurrency: 50000,
    rps:10000,
    method: "POST",
    body: {
      Phone: "8976752466"
    }
};
loadtest.loadTest(options, function(error, result)
{
    if (error)
    {
        return console.error('Got an error: %s', error);
    }
    console.log(result);
});

