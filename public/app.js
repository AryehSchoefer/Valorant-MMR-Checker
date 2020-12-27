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
const ranks = {
	3: '/images/ranks/1.png', // Iron 1
	4: '/images/ranks/2.png',
	5: '/images/ranks/3.png',
	6: '/images/ranks/4.png', // Bronze 1
	7: '/images/ranks/5.png',
	8: '/images/ranks/6.png',
	9: '/images/ranks/7.png', // Silver 1
	10: '/images/ranks/8.png',
	11: '/images/ranks/9.png',
	12: '/images/ranks/10.png', // Gold 1
	13: '/images/ranks/11.png',
	14: '/images/ranks/12.png',
	15: '/images/ranks/13.png', // Platin 1
	16: '/images/ranks/14.png',
	17: '/images/ranks/15.png',
	18: '/images/ranks/16.png', // Diamond 1
	19: '/images/ranks/17.png',
	20: '/images/ranks/18.png',
	21: '/images/ranks/19.png', // Immortal 1
	22: '/images/ranks/20.png',
	23: '/images/ranks/21.png',
	24: '/images/ranks/22.png', // Radiant
}

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

	// add loading
	loadingState(true)

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

		//display error to user
		errorMessage.style.display = 'block'
		errorMessage.textContent = 'Username or password is incorrect.'

		manageMatchHistory()
	}
})

function manageMatchHistory(matchHistory) {
	// remove loading
	loadingState(false)

	while (resultsSection.firstChild) {
		// op for this app, but might add match history who knows
		resultsSection.removeChild(resultsSection.firstChild)
	}

	for (let match of matchHistory) {
		if (match.CompetitiveMovement != 'MOVEMENT_UNKNOWN') {
			const currentElo = match.TierProgressAfterUpdate
			const oldElo = match.TierProgressBeforeUpdate
			const currentRank = match.TierAfterUpdate
			const oldRank = match.TierBeforeUpdate

			// this is so ugly, holy shit I hate it
			const eloContainer1 = document.createElement('div')
			const eloContainer2 = document.createElement('div')
			eloContainer1.setAttribute('class', 'elo-container')
			eloContainer2.setAttribute('class', 'elo-container')

			const oldEloElement1 = document.createElement('h2')
			const oldEloElement2 = document.createElement('h2')
			oldEloElement1.textContent = `Old Elo:`
			oldEloElement2.textContent = `${oldElo}`

			const currentEloElement1 = document.createElement('h2')
			const currentEloElement2 = document.createElement('h2')
			currentEloElement1.textContent = `Current Elo:`
			currentEloElement2.textContent = `${currentElo}`

			const rankContainer1 = document.createElement('div')
			const rankContainer2 = document.createElement('div')
			rankContainer1.setAttribute('class', 'rank-container')
			rankContainer2.setAttribute('class', 'rank-container')

			const oldEloImageElement = document.createElement('img')
			const newEloImageElement = document.createElement('img')
			oldEloImageElement.setAttribute('class', 'old-rank')
			newEloImageElement.setAttribute('class', 'new-rank')
			oldEloImageElement.src = ranks[oldRank]
			newEloImageElement.src = ranks[currentRank]

			eloContainer1.appendChild(oldEloElement1)
			eloContainer1.appendChild(oldEloElement2)
			eloContainer2.appendChild(currentEloElement1)
			eloContainer2.appendChild(currentEloElement2)
			rankContainer1.appendChild(oldEloImageElement)
			rankContainer2.appendChild(newEloImageElement)

			resultsSection.appendChild(eloContainer1)
			resultsSection.appendChild(eloContainer2)
			resultsSection.appendChild(rankContainer1)
			resultsSection.appendChild(rankContainer2)

			break
		}
	}
}

function loadingState(currentlyLoading) {
	if (currentlyLoading) {
		button.style.display = 'none'
		loading.style.display = 'block'
	} else {
		button.style.display = 'initial'
		loading.style.display = 'none'
	}
}
