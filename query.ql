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