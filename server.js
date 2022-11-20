import { createClient } from '@defiyield-app/sdk'
import express from 'express'
const app = express()
const apiKey = '715530d4-db80-4713-bb6d-8b60cc9aba09'
const apiUrl = 'https://public-api.defiyield.app/graphql/'
const port = 8000

app.set('view engine', 'ejs')
app.use(express.static('dist'))

const getAssetBalances = async walletToCheck => {
	const client = createClient({
		url: apiUrl,
		headers: { 'X-Api-Key': apiKey },
	})

	const chainIds = [ { "name": "ethereum", "id": 1 }, { "name": "binance", "id": 2 }, { "name": "polygon", "id": 3 }, { "name": "fantom", "id": 4 }, { "name": "avalanche", "id": 6 }, { "name": "gnosis", "id": 7 }, { "name": "celo", "id": 8 }, { "name": "moonriver", "id": 9 }, { "name": "harmony", "id": 10 }, { "name": "heco", "id": 11 }, { "name": "solana", "id": 12 }, { "name": "okx", "id": 13 }, { "name": "cronos", "id": 14 }, { "name": "kucoin", "id": 16 }, { "name": "terra", "id": 19 }, { "name": "klaytn", "id": 20 }, { "name": "fuse", "id": 21 }, { "name": "cardano", "id": 22 }, { "name": "metis", "id": 23 }, { "name": "cosmos", "id": 25 }, { "name": "kava", "id": 26 }, { "name": "osmosis", "id": 27 }, { "name": "agoric", "id": 39 }, { "name": "optimism", "id": 17 }, { "name": "sifchain", "id": 33 }, { "name": "moonbeam", "id": 31 }, { "name": "juno", "id": 34 }, { "name": "aurora", "id": 18 }, { "name": "boba", "id": 15 }, { "name": "terra 2.0", "id": 40 }, { "name": "arbitrum", "id": 5 }, { "name": "kujira", "id": 37 }, { "name": "thorchain", "id": 32 }, { "name": "ronin", "id": 24 }, { "name": "evmos", "id": 38 }, { "name": "secret", "id": 28 }, { "name": "Milkomeda", "id": 30 }, { "name": "iotex", "id": 29 }, { "name": "akash", "id": 36 }, { "name": "stargaze", "id": 35 } ]
	let assetsFound = []
	let assetNamesFound = []

	for (let i = 0; i < chainIds.length; i++) {
		const result = await client.query({
			assetBalances: [{
				walletAddress: walletToCheck,
				chainId: Number(chainIds[i].id),
			}, {
				assets: {
					asset: {
						name: true,
						chainId: true,
						symbol: true,
					},
					balance: true,
				}
			}],
		})
		if (result.data && result.data.assetBalances && result.data.assetBalances.assets.length > 0) {
			for (let a = 0; a < result.data.assetBalances.assets.length; a++) {
				const selected = result.data.assetBalances.assets[a]

				if (assetNamesFound.indexOf(selected.asset.symbol) == -1) {
					assetNamesFound.push(selected.asset.symbol)

					assetsFound.push({
						asset: {
							symbol: selected.asset.symbol,
							chains: [{
								chain: chainIds[i].name,
								balance: selected.balance,
							}]
						}
					})
				} else {
					// Asset was found and we gotta add chainBalances to the asset
					const index = assetsFound.map(assetObject => assetObject.asset.symbol).indexOf(selected.asset.symbol)
					assetsFound[index].asset.chains.push({
						chain: chainIds[i].name,
						balance: selected.balance,
					})
				}
			}
		}
	}
	return assetsFound
}

app.use('*', (req, res, next) => {
	// Logger
	let time = new Date()
	console.log(`${req.method} to ${req.originalUrl} at ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`)
	next()
})

app.get('/', (req, res) => {
	res.render('index')
})

app.get('/asset-balances/:wallet', async (req, res) => {
	const assetsFound = await getAssetBalances(req.params.wallet)

	res.send(JSON.stringify(assetsFound))
})

app.listen(port, '0.0.0.0', () => {
	console.log(`Listening on localhost:${port}`)
})
