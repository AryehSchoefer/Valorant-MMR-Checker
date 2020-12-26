const form = document.querySelector('form')
const username = document.querySelector('.username')
const password = document.querySelector('.password')
const region = document.querySelector('.region')
const button = document.querySelector('#getmmr')
const loading = document.querySelector('.loading')
const resultsSection = document.querySelector('.results')
const errorMessage = document.querySelector('.error')
const passwordInput = document.querySelector('.password')
const passwordToggle = document.querySelector('.toggle-password')

passwordToggle.addEventListener('click', () => {
	if (passwordToggle.textContent === 'show password') {
		// show password
		passwordToggle.textContent = 'hide password'
		passwordInput.type = 'text'
	} else {
		// hide password
		passwordToggle.textContent = 'show password'
		passwordInput.type = 'password'
	}
})

form.addEventListener('submit', async (e) => {
	e.preventDefault()

	errorMessage.style.display = 'none' // if error is shown hide it again

	button.style.display = 'none'
	loading.style.display = 'block'

	const user = {
		username: username.value,
		password: password.value,
		region: region.value.toLowerCase(),
	}

	try {
		const response = await fetch('/matchhistory', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(user),
		})

		const matchHistory = await response.json()
		console.log(matchHistory)
		manageMatchHistory(matchHistory)
	} catch (err) {
		console.error(err)
		errorMessage.style.display = 'block'
		errorMessage.textContent = 'Username or password is incorrect.'
		manageMatchHistory()
	}
})

function manageMatchHistory(matchHistory) {
	// remove loading
	button.style.display = 'initial'
	loading.style.display = 'none'

	while (resultsSection.firstChild) {
		// op for this app, but might add match history who knows
		resultsSection.removeChild(resultsSection.firstChild)
	}

	for (let match of matchHistory) {
		if (match.CompetitiveMovement != 'MOVEMENT_UNKNOWN') {
			const currentElo = match.TierProgressAfterUpdate
			const oldElo = match.TierProgressBeforeUpdate

			const currentEloElement = document.createElement('h2')
			currentEloElement.setAttribute('class', 'elo')
			currentEloElement.textContent = `Current Elo: ${currentElo}`

			const oldEloElement = document.createElement('h2')
			oldEloElement.setAttribute('class', 'elo')
			oldEloElement.textContent = `Old Elo: ${oldElo}`

			resultsSection.appendChild(oldEloElement)
			resultsSection.appendChild(currentEloElement)

			break
		}
	}
}
