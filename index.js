const express = require('express')
const pool = require('./config')

const app = express()
app.use(express.json())

app.get('/', (req, res) => {
	res.send('Simple API homepage')
})

app.get('/api/treks', async (req, res) => {
	try {
		const { rows } = await pool.query('SELECT * FROM treks;')
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
	// dummy data kuniks front endi pole
	const dummyData = {
		name: 'Test matk',
		latitude: '34.5',
		longitude: '23.4',
		price: '10',
		image_url: 'https://media.voog.com/0000/0030/9870/photos/Kakerdaja%20rabarada-18_huge.jpg',
		start_time: '01.01.24 19:00',
		end_time: '02.01.24 10:00',
		description: 'Öine matk',
	}
	try {
		pool.query(`
            INSERT INTO treks (name, latitude, longitude, price, image_url, start_time, end_time, description)
            VALUES ('${dummyData.name}', '${dummyData.latitude}', '${dummyData.longitude}', '${dummyData.price}', '${dummyData.image_url}', '${dummyData.start_time}', '${dummyData.end_time}', '${dummyData.description}');
        `)
		// Mis siin oleks õige tagastada?
		res.send(dummyData)
	} catch (error) {
		console.log(error)
		res.status(500).send(error.message)
	}
})

app.put('/api/treks/:id', async (req, res) => {
	const idFromParams = parseInt(req.params.id, 10)
	// dummy data kuniks front endi pole
	const objectWithNewKeyValues = {
		name: 'Uusim matk',
		price: '4',
	}
	// Kuidas saaks dünaamiliselt SET väärtusi query-sse anda, st kui ei ole teada, kui mitu ja milliseid veerge on vaja uuendada?
	try {
		pool.query(`
            UPDATE treks
	        SET name='${objectWithNewKeyValues.name}', price='${objectWithNewKeyValues.price}'
            WHERE id=${idFromParams}
	    `)
		res.send(objectWithNewKeyValues)
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
