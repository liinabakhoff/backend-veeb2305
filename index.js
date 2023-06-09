const express = require('express')
const cors = require('cors')
const pool = require('./config')

const app = express()
app.use(express.json())
app.use(
	cors({
		origin: '*',
	})
)

app.get('/', (req, res) => {
	res.send('Simple API homepage')
})

app.get('/api/treks', async (req, res) => {
	try {
		const { rows } = await pool.query('SELECT * FROM treks ORDER BY id;')
		res.json(rows)
	} catch (error) {
		console.log(error)
		res.status(500).send(error.message)
	}
})

app.get('/api/treks/:id', async (req, res) => {
	const idFromParams = parseInt(req.params.id, 10)
	try {
		const { rows } = await pool.query(`SELECT * FROM treks WHERE id=${idFromParams};`)
		res.json(rows)
	} catch (error) {
		console.log(error)
		res.status(500).send(error.message)
	}
})

app.post('/api/treks', async (req, res) => {
	try {
		const { rows } = await pool.query(`
            INSERT INTO treks (name, latitude, longitude, price, image_url, start_time, end_time, description)
            VALUES ('${req.body.name}', '${req.body.latitude}', '${req.body.longitude}', '${req.body.price}', '${req.body.image_url}', '${req.body.start_time}', '${req.body.end_time}', '${req.body.description}')
			RETURNING id;
        `)
		res.status(201).json(rows)
	} catch (error) {
		console.log(error)
		res.status(500).send(error.message)
	}
})

app.put('/api/treks/:id', async (req, res) => {
	const idFromParams = parseInt(req.params.id, 10)
	console.log('req', req.body)
	try {
		pool.query(`
            UPDATE treks
	        SET name='${req.body.name}', latitude='${req.body.latitude}', longitude='${req.body.longitude}', price='${req.body.price}', image_url='${req.body.image_url}', start_time='${req.body.start_time}', end_time='${req.body.end_time}', description='${req.body.description}'
            WHERE id=${idFromParams}
	    `)
		res.status(201).json(req.body)
	} catch (error) {
		console.log(error)
		res.status(500).send(error.message)
	}
})

app.delete('/api/treks/:id', async (req, res) => {
	const idFromParams = parseInt(req.params.id, 10)
	try {
		pool.query(`
            DELETE FROM treks
            WHERE id=${idFromParams}
	    `)
		res.send(idFromParams.toString())
	} catch (error) {
		console.log(error)
		res.status(500).send(error.message)
	}
})

app.listen(10000, () => {
	console.log('Server running on port 10000')
})
