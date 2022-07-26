private_key_file="dev-keypair.private"
passphrase_file="dev-keypair.passphrase"
public_key_file="dev-keypair.public"

if [ ! -f "$private_key_file" ]; then
  npm install dotenv-cli -g
  yes '' | solana-keygen new --outfile "$private_key_file" > "$passphrase_file"
  private_key=$(cat $private_key_file)
  public_key=$(solana-keygen pubkey "$private_key_file")
  echo "$public_key" > "$public_key_file"
  echo "DAPP_PRIVATE_KEY=${private_key}
DAPP_PUBLIC_KEY=${public_key}" > .env.client
  echo "DIALECT_SDK_CREDENTIALS=${private_key}" > .env.service
  solana airdrop 2 "$public_key" -u http://localhost:8899
  solana airdrop 2 "$public_key" -u https://api.devnet.solana.com/
fi


