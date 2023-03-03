document.addEventListener('DOMContentLoaded', () => {
	const output = document.querySelector('.table');
	const timer = document.querySelector('.timer');
	const first = document.querySelector('.first');
	const second = document.querySelector('.second');
	const third = document.querySelector('.third');
	const flagsLeftTens = document.querySelector('.flags-left-tens');
	const flagsLeftOnes = document.querySelector('.flags-left-ones');
	const smile = document.querySelector('.smile');
	let width = 16;
	let bombAmount = 40;
	let flags = 0;
	let squares = [];
	let isGameOver = false;
	let clicks = 0;
	const grid = { rows: 16, cols: 16 };
	const total = grid.rows * grid.cols;

	createGrid(total);
	let count = 0;
	let tens = 0;
	let hunds = 0;

	function startTimer() {
		if (count <= 9) {
			first.className = `num tablo-${count++} first`;
		} else {
			count = 1;
			first.className = `num tablo-${count++} first`;
		}
		const sec = setInterval(() => {
			if (count <= 9) {
				first.className = `num tablo-${count++} first`;
			} else {
				count = 1;
				first.className = `num tablo-${count++} first`;
				if (tens <= 9) {
					second.className = `num tablo-${tens++} second`;
				} else {
					tens = 1;
					second.className = `num tablo-${tens++} second`;
					if (hunds <= 9) {
						third.className = `num tablo-${hunds++} third`;
					}
				}
			}
		}, 1000);
		setTimeout(() => {
			second.className = `num tablo-${tens++} second`;
		}, 10000);
		setTimeout(() => {
			third.className = `num tablo-${hunds++} second`;
		}, 100000);

		setInterval(() => {
			if (isGameOver) {
				clearInterval(sec);
				return;
			}
		}, 10);
	}

	function onceFunc(func) {
		let called = false;
		return function () {
			if (!called) {
				called = true;
				return func();
			}
			return;
		};
	}

	startTimer = onceFunc(startTimer);

	function createGrid(tot) {
		const bombsArray = Array(bombAmount).fill('bomb');
		const emptyArray = Array(width * width - bombAmount).fill('valid');
		const gameArray = emptyArray.concat(bombsArray);
		const shuffledArray = gameArray.sort(() => Math.random() - 0.5);

		for (let i = 0; i < tot; i++) {
			const square = document.createElement('div');
			square.classList.add(shuffledArray[i]);
			output.appendChild(square);
			square.setAttribute('id', i);
			squares.push(square);

			square.addEventListener('mousedown', () => {
				smile.classList.add('shock');
			});
			square.addEventListener('mouseup', () => {
				smile.classList.remove('shock');
			});

			square.addEventListener('click', function (e) {
				if (isGameOver) return;
				click(square);
				startTimer();
			});

			output.style.setProperty(
				`grid-template-columns`,
				`repeat(${grid.cols}, 1fr)`
			);

			square.oncontextmenu = function (e) {
				e.preventDefault();
				addFlag(square);
			};
		}

		for (let i = 0; i < squares.length; i++) {
			let total = 0;
			const isLeftEdge = i % width === 0;
			const isRightEdge = i % width === width - 1;

			if (squares[i].classList.contains('valid')) {
				if (i > 0 && !isLeftEdge && squares[i - 1].classList.contains('bomb'))
					total++;
				if (
					i > 15 &&
					!isRightEdge &&
					squares[i + 1 - width].classList.contains('bomb')
				)
					total++;
				if (i > 16 && squares[i - width].classList.contains('bomb')) total++;
				if (
					i > 17 &&
					!isLeftEdge &&
					squares[i - 1 - width].classList.contains('bomb')
				)
					total++;
				if (
					i < 254 &&
					!isRightEdge &&
					squares[i + 1].classList.contains('bomb')
				)
					total++;
				if (
					i < 224 &&
					!isLeftEdge &&
					squares[i - 1 + width].classList.contains('bomb')
				)
					total++;
				if (
					i < 238 &&
					!isRightEdge &&
					squares[i + 1 + width].classList.contains('bomb')
				)
					total++;
				if (i < 239 && squares[i + width].classList.contains('bomb')) total++;
				squares[i].setAttribute('data', total);
			}
		}
	}

	function addFlag(square) {
		if (isGameOver) return;
		if (!square.classList.contains('checked') && flags < bombAmount) {
			if (
				!square.classList.contains('flag') &&
				!square.classList.contains('question')
			) {
				square.classList.remove('question');
				square.classList.add('flag');
				bombAmount--;
				let tens = bombAmount.toString().split('')[0];
				let ones = bombAmount.toString().split('')[1];
				flagsLeftTens.className = `num tablo-${tens} flags-left`;
				flagsLeftOnes.className = `num tablo-${ones} flags-left`;
			} else if (square.classList.contains('flag')) {
				square.classList.remove('flag');
				square.classList.add('question');
			} else {
				square.classList.remove('question');
				bombAmount++;
				let tens = bombAmount.toString().split('')[0];
				let ones = bombAmount.toString().split('')[1];
				flagsLeftTens.className = `num tablo-${tens} flags-left`;
				flagsLeftOnes.className = `num tablo-${ones} flags-left`;
				square.innerHTML = '';
			}
		}
	}

	function click(square) {
		let currentId = square.id;
		clicks++;

		if (
			square.classList.contains('checked') ||
			square.classList.contains('flag') ||
			square.classList.contains('question')
		)
			return;
		if (square.classList.contains('bomb') && clicks !== 1) {
			gameOver(square);
		} else if (square.classList.contains('bomb') && clicks === 1) {
			alert('Ooops! Try again!');
			setTimeout(() => {
				square.classList.remove('checked');
			}, 10);
		} else {
			let total = square.getAttribute('data');
			if (total != 0) {
				square.classList.add('checked');
				if (total == 1) square.classList.add('one');
				if (total == 2) square.classList.add('two');
				if (total == 3) square.classList.add('three');
				if (total == 4) square.classList.add('four');
				if (total == 5) square.classList.add('five');
				if (total == 6) square.classList.add('six');
				if (total == 7) square.classList.add('seven');
				if (total == 8) square.classList.add('eight');

				return;
			}
			checkSquare(square, currentId);
		}

		square.classList.add('checked');
	}

	function checkSquare(square, currentId) {
		const isLeftEdge = currentId % width === 0;
		const isRightEdge = currentId % width === width - 1;

		setTimeout(() => {
			if (currentId > 0 && !isLeftEdge) {
				const newId = squares[parseInt(currentId) - 1].id;

				const newSquare = document.getElementById(newId);
				click(newSquare);
			}
			if (currentId > 15 && !isRightEdge) {
				const newId = squares[parseInt(currentId) + 1 - width].id;

				const newSquare = document.getElementById(newId);
				click(newSquare);
			}
			if (currentId > 16) {
				const newId = squares[parseInt(currentId - width)].id;

				const newSquare = document.getElementById(newId);
				click(newSquare);
			}
			if (currentId > 17 && !isLeftEdge) {
				const newId = squares[parseInt(currentId) - 1 - width].id;
				const newSquare = document.getElementById(newId);
				click(newSquare);
			}
			if (currentId < 254 && !isRightEdge) {
				const newId = squares[parseInt(currentId) + 1].id;

				const newSquare = document.getElementById(newId);
				click(newSquare);
			}
			if (currentId < 224 && !isLeftEdge) {
				const newId = squares[parseInt(currentId) - 1 + width].id;

				const newSquare = document.getElementById(newId);
				click(newSquare);
			}
			if (currentId < 238 && !isRightEdge) {
				const newId = squares[parseInt(currentId) + 1 + width].id;

				const newSquare = document.getElementById(newId);
				click(newSquare);
			}
			if (currentId < 239) {
				const newId = squares[parseInt(currentId) + width].id;

				const newSquare = document.getElementById(newId);
				click(newSquare);
			}
			checkForWin();
		}, 10);
	}

	smile.addEventListener('click', () => {
		document.location.reload();
	});

	function gameOver(square) {
		isGameOver = true;
		smile.classList.add('sad');
		if (square.classList.contains('bomb')) {
			square.classList.add('bomb-red');
		}
		squares.forEach(square => {
			if (square.classList.contains('bomb')) {
				square.classList.add('bomb-show');
			}
		});
	}

	function checkForWin() {
		let validsArr = squares.filter(square => {
			if (square.classList.contains('valid')) {
				return square;
			}
		});
		if (
			validsArr.filter(v => !v.classList.contains('checked')).length === 0 &&
			!isGameOver
		) {
			smile.classList.remove('sad');
			smile.classList.add('cool');
			isGameOver = true;
		}
	}
});
