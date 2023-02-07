import { createClient } from '@defiyield-app/sdk'
import express from 'express'
const app = express()
const apiKey = '9c7143f3-a206-4829-b487-d4960d422edb'
const apiUrl = 'https://public-api.defiyield.app/graphql/'
const port = 8000

app.set('view engine', 'ejs')
app.use(express.static('dist'))

const getPositions = async walletToCheck => {
	const client = createClient({
		url: apiUrl,
		headers: { 'X-Api-Key': apiKey },
	})
	const protocols = ["0VIX","AuraFinance","StakeLy","AaveV2","AaveV3","Abracadabra","ACryptoS","AgoricStaking","AkashStaking","AlchemixV2","AlpacaFinance","ApeSwap","ArrakisFinance","AutoFarm","BabySwap","Badger","BalancerV1","BalancerV2","Bancor","Bastion","Beefy","BeethovenX","BeltFinance","BenQI","Biswap","Blizz","Blueshift","BNBStaking","CafeSwap","CardanoStaking","Channels","CheesecakeSwap","CherrySwap","Compound","CompoundV3","Convex","CosmosStaking","CREAMFinance","Crescent","Crypto.comDeFiSwap","CubFinance","Curve","DefiKingdoms","dForce","Dfyn","DODO","Elk","EllipsisFinance","Euler","EvmosStaking","EvoDefi","FilDa","Frax","Gearbox","GeistFinance","Gmx","GooseFinance","Hubble","IronBank","IronFinance","JunoStaking","JunoSwap","KavaCDP","KavaLend","KavaStaking","KavaSwap","KlaySwap","KnightSwap","KujiraStaking","KyberSwap","Lido","LiquidDriver","Liquity","LoopMarket","MMFinance","MMFinance","MakerDAO","Marinade","MarsEcosystem","MDEX","Meld","Minswap","MojitoSwap","Moola","Moonwell","MuesliSwap","NereusFinance","Netswap","NexusMutual","OccamX","OlympusDAO","OlympusPro","Orca","Osmosis","OsmosisStaking","PaintSwap","PancakeSwap","Pangolin","PlatypusFinance","PolygonStaking","QiDao","Quarry","Quickswap","Raydium","RocketPool","Rune","Saber","SashimiSwap","SecretStaking","SifchainStaking","SolanaStaking","Solend","SpiritSwap","SpookySwap","Stader","Stakewise","Stargate","StargazeStaking","Strike","SundaeSwap","SushiSwap","Swapr","Synapse","Synthetix","Tectonic","Terra2.0Staking","TerraStaking","ThorLiquidity","ThorStaking","Tokemak","Tomb.finance","TraderJoe","Tranchess","TreeDefi","Trisolaris","Uniswap","UniswapV3","VVS","Velodrome","Venus","ViperSwap","VyFinance","WaultFinance","WePiggy","WingRiders","WombatExchange","Wonderland","YearnV1","YearnV2","YelFinance","YetiFinance","Zenlink"]
	let positionsFound = []

	console.log('walletToCheck', walletToCheck)

	let queries = []
	for (let i = 0; i < protocols.length; i++) {
		queries.push(client.query({
			protocolBalance: [{
				balances: {
					walletAddress: walletToCheck,
					chainIds: 1,
					protocolName: protocols[i],
				},
			}, {
				total: true,
				chains: {
					positions: {
						supplied: {
							amount: true,
							value: true,
							tvl: true,
							token: {
								displayName: true,
							}
						}
					},
				},
			}],
		}))
	}

	let results = []
	try {
		results = await Promise.all(queries)
	} catch (e) {
		console.log('error', e)
		return { error: e }
	}

	for (let i = 0; i < results.length; i++) {
		const result = results[i]
		console.log('result', JSON.stringify(result))
		if (result.data.protocolBalance.length > 0 && result.data.protocolBalance[0].total > 0) {
			const total = result.data.protocolBalance[0].total
			// Not all protocols have positions
			if (result.data.protocolBalance[0].chains && result.data.protocolBalance[0].chains.length > 0) {
				positionsFound.push({
					protocol: protocols[i],
					total,
					positions: result.data.protocolBalance[0].chains[0].positions.map(posi => {
						return {
							tokens: posi.supplied.map(sup => sup.token.displayName).join('/'),
							balance: posi.supplied[0].amount,
							poolShare: posi.supplied[0].amount * 100 / posi.supplied[0].tvl,
							usd: posi.supplied[0].value,
						}
					}),
				})
			} else {
				positionsFound.push({
					protocol: protocols[i],
					total,
					positions: null,
				})
			}
		}
	}
	return positionsFound
}

const getAssetBalances = async walletToCheck => {
	const client = createClient({
		url: apiUrl,
		headers: { 'X-Api-Key': apiKey },
	})

	const chainIds = [ { "name": "ethereum", "id": 1 }, { "name": "binance", "id": 2 }, { "name": "polygon", "id": 3 }, { "name": "fantom", "id": 4 }, { "name": "avalanche", "id": 6 }, { "name": "gnosis", "id": 7 }, { "name": "celo", "id": 8 }, { "name": "moonriver", "id": 9 }, { "name": "harmony", "id": 10 }, { "name": "heco", "id": 11 }, { "name": "solana", "id": 12 }, { "name": "okx", "id": 13 }, { "name": "cronos", "id": 14 }, { "name": "kucoin", "id": 16 }, { "name": "terra", "id": 19 }, { "name": "klaytn", "id": 20 }, { "name": "fuse", "id": 21 }, { "name": "cardano", "id": 22 }, { "name": "metis", "id": 23 }, { "name": "cosmos", "id": 25 }, { "name": "kava", "id": 26 }, { "name": "osmosis", "id": 27 }, { "name": "agoric", "id": 39 }, { "name": "optimism", "id": 17 }, { "name": "sifchain", "id": 33 }, { "name": "moonbeam", "id": 31 }, { "name": "juno", "id": 34 }, { "name": "aurora", "id": 18 }, { "name": "boba", "id": 15 }, { "name": "terra 2.0", "id": 40 }, { "name": "arbitrum", "id": 5 }, { "name": "kujira", "id": 37 }, { "name": "thorchain", "id": 32 }, { "name": "ronin", "id": 24 }, { "name": "evmos", "id": 38 }, { "name": "secret", "id": 28 }, { "name": "Milkomeda", "id": 30 }, { "name": "iotex", "id": 29 }, { "name": "akash", "id": 36 }, { "name": "stargaze", "id": 35 } ]
	let assetsFound = []
	let assetNamesFound = []
	let queries = []

	for (let i = 0; i < chainIds.length; i++) {
		queries.push(client.query({
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
					total: true,
				}
			}],
		}))
	}

	let results = []
	try {
		results = await Promise.all(queries)
	} catch (e) {
		return { error: e }
	}

	for (let i = 0; i < results.length; i++) {
		const result = results[i]
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
							}],
							usd: selected.total,
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

// Returns the top 100 opportunities on the Ethereum blockchain for simplicity
const getDefiOpportunities = async () => {
	const client = createClient({
		url: apiUrl,
		headers: { 'X-Api-Key': apiKey },
	})

	/*
		chains = [{id, abbr}]
	*/
	let chains = []
	try {
		const chainsQuery = await client.query({
			chains: {
				id: true,
				abbr: true,
			}
		})
		chains = chainsQuery.data.chains
	} catch (e) {
		return { error: e }
	}

	let result = null
	try {
		result = await client.query({
			opportunities: [{
				first: 50,
			}, {
				farm: {
					slug: true,
					logo: true,
					categories: true,
				},
				chainId: true,
				totalValueLocked: true,
				tokens: {
					rewards: {
						displayName: true,
					},
					deposits: {
						displayName: true,
					}
				},
				apr: true,
			}]
		})
	} catch (e) {
		return { error: e }
	}

	const resultsFormatted = result.data.opportunities.map(item => {
		const chainFound = chains.find(chain => chain.id == item.chainId)
		return {
			slug: item.farm.slug,
			chain: chainFound.abbr,
			category: item.farm.categories[0],
			logo: item.farm.logo,
			totalValueLocked: item.totalValueLocked,
			deposits: item.tokens.deposits.map(deposits => deposits.displayName).join(' + '),
			rewards: item.tokens.rewards.map(reward => reward.displayName).join(' + '),
			apr: item.apr,
		}
	})

	return resultsFormatted
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
	if (assetsFound.error) {
		return res.send(JSON.stringify({error: assetsFound.error}))
	}

	res.send(JSON.stringify(assetsFound))
})

app.get('/positions/:wallet', async (req, res) => {
	const positionsFound = await getPositions(req.params.wallet)
	if (positionsFound.error) {
		return res.send(JSON.stringify({error: positionsFound.error}))
	}

	res.send(JSON.stringify(positionsFound))
})

app.get('/opportunities', async (req, res) => {
	const opportunities = await getDefiOpportunities()
	if (opportunities.error) {
		return res.send(JSON.stringify({error: opportunities.error}))
	}

	res.send(JSON.stringify(opportunities))
})

app.listen(port, '0.0.0.0', () => {
	console.log(`Listening on localhost:${port}`)
})
