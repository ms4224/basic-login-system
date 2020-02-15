//read up on the module here https://node-postgres.com/features/pooling

const { Pool } = require('pg')

const pool = new Pool({
	  connectionString: process.env.DATABASE_URL,
	  ssl: true
	})

// the pool with emit an error on behalf of any idle clients
// it contains if a backend error or network partition happens
pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err)
  process.exit(-1)
})

// callback - checkout a client
function executeQuery(queryString, cb){
	pool.connect((err, client, done) => {
  if (err) console.log(err);
  client.query(queryString, (err, res) => {
    done()

    if (err) {
      console.log(err.stack)
    } 
    // else {
    //   console.log(res.rows[0])
    // }

    if ((cb!=undefined)&&(typeof(cb)==='function'))cb(err, res);
  })
})
}


module.exports = {
	executeQuery: executeQuery
}