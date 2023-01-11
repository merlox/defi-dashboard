# Write your query or mutation here
query {
  opportunities(
    first: 10,
  ) {
    id
    chainId
    apr
    totalValueLocked
    categories
    investmentUrl
    isNew
    status
    farm {
      id 
      url 
      slug 
      logo 
      categories
    }
    tokens {
      borrowRewards {
        displayName
      }
      deposits {
        displayName
      }
      rewards {
        displayName
      }
    }
  }
}


opportunities[0].farm.slug (market name)
opportunities[0].farm.logo
opportunities[0].totalValueLocked.toFixed(3) (format Billions and Millions and K thousand)
opportunities[0].tokens.rewards[0].displayName
opportunities[0].apr