const axios = require('axios')
const express = require('express')
const cors = require('cors')

const app = express()
app.use(express.json())
app.use(cors())
app.use(express.static('public'))

app.post('/matchhistory', async (req, res) => {
	const { username, password, region } = req.body

	const cookies = await getCookies()
	const accessToken = await getAccessToken(cookies, username, password)
	const entitlementsToken = await getEntitlementsToken(accessToken, cookies)
	const userID = await getUserID(accessToken)
	const matchData = await getMatchHistory(accessToken, entitlementsToken, region, userID)

	res.json(matchData)
})

async function getCookies() {
	const url = 'https://auth.riotgames.com/api/v1/authorization'

	try {
		const response = await axios.post(url, {
			client_id: 'play-valorant-web-prod',
			nonce: '1',
			redirect_uri: 'https://playvalorant.com/opt_in',
			response_type: 'token id_token',
			scope: 'account openid',
		})

		return response.headers['set-cookie']
	} catch (err) {
		console.error(err)
	}
}

async function getAccessToken(cookies, username, password) {
	const url = 'https://auth.riotgames.com/api/v1/authorization'

	try {
		const response = await axios.put(
			url,
			{
				type: 'auth',
				username: username,
				password: password,
			},
			{
				headers: {
					Cookie: cookies,
				},
			}
		)

		const { uri } = response.data.response.parameters
		const accessToken = uri.split('=')[1].split('&')[0]

		return accessToken
	} catch (err) {
		console.error(err)
	}
}

async function getEntitlementsToken(accessToken, cookies) {
	const url = 'https://entitlements.auth.riotgames.com/api/token/v1'
	const auth = `Bearer ${accessToken}`

	try {
		const response = await axios.post(
			url,
			{},
			{
				headers: {
					Authorization: auth,
					Cookie: cookies,
				},
			}
		)

		const entitlementsToken = response.data.entitlements_token
		return entitlementsToken
	} catch (err) {
		console.error(err)
	}
}

async function getUserID(accessToken) {
	const url = 'https://auth.riotgames.com/userinfo'
	const auth = `Bearer ${accessToken}`

	try {
		const response = await axios.post(
			url,
			{},
			{
				headers: {
					Authorization: auth,
				},
			}
		)

		const userID = response.data.sub
		return userID
	} catch (err) {
		console.error(err)
	}
}

async function getMatchHistory(accessToken, entitlementsToken, region, userID) {
	const url = `https://pd.${region}.a.pvp.net/mmr/v1/players/${userID}/competitiveupdates?startIndex=0&endIndex=20`

	const auth = `Bearer ${accessToken}`
	const entitlementsJWT = entitlementsToken

	try {
		const response = await axios.get(url, {
			headers: {
				Authorization: auth,
				'X-Riot-Entitlements-JWT': entitlementsJWT,
			},
		})

		const matches = response.data.Matches
		return matches
	} catch (err) {
		console.error(err)
	}
}

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
	console.log(`Server started on port ${PORT}`)
})
