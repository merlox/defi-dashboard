import { chain, configureChains, createClient } from '@wagmi/core'
import { ClientCtrl, ConfigCtrl } from '@web3modal/core'
import { EthereumClient, modalConnectors, walletConnectProvider } from '@web3modal/ethereum'

const setupWallet = async () => {
    // 1. Define constants
    const projectId = '8e6b5ffdcbc9794bf9f4a1952578365b'
    const chains = [chain.mainnet]

    // 2. Configure wagmi client
    const { provider } = configureChains(chains, [walletConnectProvider({ projectId })])
    const wagmiClient = createClient({
        autoConnect: true,
        connectors: modalConnectors({ appName: 'web3Modal', chains }),
        provider
    })

    // 3. Configure ethereum client
    const ethereumClient = new EthereumClient(wagmiClient, chains)

    // 4. Configure modal and pass ethereum client to it
    ConfigCtrl.setConfig({
        projectId,
        theme: 'dark',
        accentColor: 'default'
    })
    ClientCtrl.setEthereumClient(ethereumClient, chains)

    // Detects when an account is connected, when an account is disconnected
    // and when an account is changed with a different wallet
    ethereumClient.watchAccount(async change => {
        document.querySelector('#wallet').innerHTML = change.address || ''
        if (change.address) {
            document.querySelector('#asset-container').innerHTML = ''
            document.querySelector('#loading-assets').style.display = 'inherit'
            document.querySelector('#connect-message').style.display = 'none'
            document.querySelector('#loading-positions').style.display = 'none'
            await getAssets('0xC36442b4a4522E871399CD717aBDD847Ab11FE88')
            // await getAssets(change.address)
            document.querySelector('#loading-positions').style.display = 'inherit'
            await getPositions('0x7c5bAe6BC84AE74954Fd5672feb6fB31d2182EC6')
            //await getPositions(change.address)
            // await getPositions(change.address)
            document.querySelector('#loading-positions').style.display = 'none'
            document.querySelector('#connect-message').style.display = 'none'
            document.querySelector('#loading-assets').style.display = 'none'
        } else {
            document.querySelector('#connect-message').style.display = 'inherit'
            document.querySelector('#loading-assets').style.display = 'none'
            document.querySelector('#asset-container').innerHTML = ''
            document.querySelector('#loading-positions').style.display = 'none'
        }
    })

    // 5. Import ui package after all configuration has been completed
    await import('@web3modal/ui')
}

const getAssets = async wallet => {
    console.log('getting assets')
    let res = await fetch(`/asset-balances/${wallet}`)
    res = await res.json()
    console.log('assets received')
    if (res.error) {
        console.log(res.error)
        return alert(res.error)
    }

    let totalUSD = 0

    for (let i = 0; i < res.length; i++) {
        let usd = res[i].asset.usd.toFixed(3) == 0 ? 0 : Number(res[i].asset.usd.toFixed(3))
        totalUSD += res[i].asset.usd
        const chainsArray = res[i].asset.chains.map(item => {
            let formattedBalance = item.balance.toFixed(3) == 0 ? 0 : Number(item.balance.toFixed(3))
            if (formattedBalance == 0) formattedBalance = '~0'
            return `
                <li>
                    ${item.chain}: ${formattedBalance} ${res[i].asset.symbol} (${usd == 0 ? '~$0' : '$' + usd})
                </li>
            `
        })
        document.querySelector('#asset-container').insertAdjacentHTML('beforeend', `
            <li class="asset">
                <b>${res[i].asset.symbol}</b>
                <ul>
                    ${chainsArray.join(' ')}
                </ul>
            </li>
        `)
    }

    document.querySelector('#net-worth-container').style.display = 'block'
    document.querySelector('#net-worth').innerHTML = totalUSD.toFixed(3)
}

const getPositions = async wallet => {
    console.log('getting positions x')
    const res = await fetch(`/positions/${wallet}`)
    const positionsReceived = await res.json()
    if (positionsReceived.error) {
        console.log(positionsReceived.error)
        return alert(positionsReceived.error)
    }
    let html = ''

    console.log('positions received', positionsReceived)

    if (positionsReceived.length == 0) {
        html = "You don't have any positions right now"
    } else {
        html = positionsReceived.map(pos => {
            const total = pos.total.toFixed(5) == 0 ? '~0' : pos.total.toFixed(5)
            return `<li class="position asset">
                <p>${pos.protocol}: $${total}</p>
                <table style="width: 100%;">
                    <thead>
                        <tr>
                            <th>Tokens</th>
                            <th>Balance</th>
                            <th>Share</th>
                            <th>USD</th>
                        </tr>                    
                    </thead>

                    <tbody>
                    ${pos.positions.map(p => {
                        console.log()
                        console.log(p)
                        console.log()
                        const balance = p.balance.toFixed(5) == 0 ? '~0' : p.balance.toFixed(5)
                        const share = p.poolShare.toFixed(5) == 0 ? '~0' : p.poolShare.toFixed(5)
                        const usd = p.usd.toFixed(5) == 0 ? '~$0' : '$' + p.usd.toFixed(5)
                        return `<tr>
                                <td>${p.tokens}</td>
                                <td>${balance}</td>
                                <td>${share}%</td>
                                <td>${usd}</td>
                            </tr>`
                    }).join('')}
                    </tbody>
                </table>
            </li>`
        }).join('')
    }

    document.querySelector('#staking-positions-title').style.display = 'inherit'
    document.querySelector('#staking-positions').style.display = 'inherit'
    document.querySelector('#staking-positions').innerHTML = html
}

const nFormatter = (num, digits) => {
	const lookup = [
		{ value: 1, symbol: "" },
		{ value: 1e3, symbol: "k" },
		{ value: 1e6, symbol: "M" },
		{ value: 1e9, symbol: "B" },
		{ value: 1e12, symbol: "T" },
		{ value: 1e15, symbol: "P" },
		{ value: 1e18, symbol: "E" }
	];
	const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
	var item = lookup.slice().reverse().find(function (item) {
		return num >= item.value;
	});
	return item ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol : "0";
}

const getOpportunities = async () => {
    console.log('Getting opportunities')
    const res = await fetch('/opportunities')
    const opportunities = await res.json()
    if (opportunities.error) {
        console.log(opportunities.error)
        return alert(opportunities.error)
    }
    let html = ''

    console.log()
    console.log('opportunities', opportunities)
    console.log()

    opportunities.map(item => {
        html += `
            <tr>
                <td class="opportunities-item-name">
                    <img src="${item.logo}" />
                    <span>${item.slug}</span>
                </td>
                <td class="opportunities-chain">${item.chain}</td>
                <td class="opportunities-deposit-token">${item.deposits}</td>
                <td class="opportunities-category">${item.category}</td>
                <td class="opportunities-item-tlv">${nFormatter(item.totalValueLocked, 2)}</td>
                <td class="opportunities-item-rewards">${item.rewards}</td>
                <td class="opportunities-item-apr">${(item.apr * 100).toFixed(3) + '%'}</td>
            </tr>
        `
    })

    document.querySelector('#opportunities-items').innerHTML = html
}

window.addEventListener('load', () => {
    setupWallet()
})

document.querySelectorAll('.defi-buttons button').forEach(button => {
    button.addEventListener('click', e => {
        [...document.querySelectorAll('.defi-buttons button')].map(b => b.className = '')
        e.target.className = 'selected'

        switch (e.target.dataset.defi) {
            case 'dashboard':
                document.querySelector('.dashboard-page').style.display = 'inherit'
                document.querySelector('.opportunities-page').style.display = 'none'
                break
            case 'opportunities':
                document.querySelector('.dashboard-page').style.display = 'none'
                document.querySelector('.opportunities-page').style.display = 'inherit'
                getOpportunities()
                break
        }
    })
})