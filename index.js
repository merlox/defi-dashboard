import { createClient } from '@defiyield-app/sdk'
import express from 'express'
import ejs from 'ejs'
const app = express()
const apiKey = '715530d4-db80-4713-bb6d-8b60cc9aba09'
const apiUrl = 'https://public-api.defiyield.app/graphql/'
const walletToCheck = '0x7c5bAe6BC84AE74954Fd5672feb6fB31d2182EC6'
const port = 8000

app.set('view engine', 'ejs')
app.use(express.static('dist'))

const getAssetBalances = async () => {
	const client = createClient({
		url: apiUrl,
		headers: { 'X-Api-Key': apiKey },
	})

	const chainIds = [{ "name": "ethereum", "absoluteChainId": "1" }, { "name": "binance", "absoluteChainId": "56" }, { "name": "polygon", "absoluteChainId": "137" }, { "name": "fantom", "absoluteChainId": "250" }, { "name": "avalanche", "absoluteChainId": "43114" }, { "name": "gnosis", "absoluteChainId": "100" }, { "name": "celo", "absoluteChainId": "42220" }, { "name": "moonriver", "absoluteChainId": "1285" }, { "name": "harmony", "absoluteChainId": "1666600000" }, { "name": "heco", "absoluteChainId": "128" }, { "name": "solana", "absoluteChainId": "101" }, { "name": "okx", "absoluteChainId": "66" }, { "name": "cronos", "absoluteChainId": "25" }, { "name": "kucoin", "absoluteChainId": "321" }, { "name": "terra", "absoluteChainId": "columbus-5" }, { "name": "klaytn", "absoluteChainId": "8217" }, { "name": "fuse", "absoluteChainId": "122" }, { "name": "cardano", "absoluteChainId": "1003" }, { "name": "metis", "absoluteChainId": "1088" }, { "name": "cosmos", "absoluteChainId": "2004" }, { "name": "kava", "absoluteChainId": "2005" }, { "name": "osmosis", "absoluteChainId": "2006" }, { "name": "agoric", "absoluteChainId": "2014" }, { "name": "optimism", "absoluteChainId": "10" }, { "name": "sifchain", "absoluteChainId": "2009" }, { "name": "moonbeam", "absoluteChainId": "1284" }, { "name": "juno", "absoluteChainId": "2010" }, { "name": "aurora", "absoluteChainId": "1313161554" }, { "name": "boba", "absoluteChainId": "288" }, { "name": "terra 2.0", "absoluteChainId": "2015" }, { "name": "arbitrum", "absoluteChainId": "42161" }, { "name": "kujira", "absoluteChainId": "2013" }, { "name": "thorchain", "absoluteChainId": "2008" }, { "name": "ronin", "absoluteChainId": "1002" }, { "name": "evmos", "absoluteChainId": "9001" }, { "name": "secret", "absoluteChainId": "2007" }, { "name": "Milkomeda", "absoluteChainId": "2001" }, { "name": "iotex", "absoluteChainId": "1099" }, { "name": "akash", "absoluteChainId": "2012" }, { "name": "stargaze", "absoluteChainId": "2011" }]
	let assetsFound = []
	let assetNamesFound = []

	for (let i = 0; i < chainIds.length; i++) {
		const result = await client.query({
			assetBalances: [{
				walletAddress: walletToCheck,
				chainId: Number(chainIds[i].absoluteChainId),
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
							name: selected.asset.symbol,
							chains: [{
								chain: chainIds[i].name,
								balance: selected.balance,
							}]
						}
					})
				} else {
					// Asset was found and we gotta add chainBalances to the asset
					const index = assetsFound.indexOf(selected.asset.symbol)
					assetsFound[index].chains.push({
						chain: chainIds[i].name,
						balance: selected.balance,
					})
				}
			}
			// console.log('assets found', JSON.stringify(assetNamesFound, null, 4))
			// Add every asset to assetsFound + add the asset with the blockchain
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

app.get('/asset-balances', async (req, res) => {
	const assetsFound = await getAssetBalances()

	res.send(JSON.stringify(assetsFound))
})

app.listen(port, '0.0.0.0', () => {
	console.log(`Listening on localhost:${port}`)
})
