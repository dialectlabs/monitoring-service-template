set -e

private_key_file="local-development-keypair.private"
passphrase_file="local-development-keypair.passphrase"
public_key_file="local-development-keypair.public"

if [ ! -f "$private_key_file" ]; then
  yes '' | solana-keygen new --outfile "$private_key_file" > "$passphrase_file"
  private_key=$(cat $private_key_file)
  public_key=$(solana-keygen pubkey "$private_key_file")
  echo "$public_key" > "$public_key_file"
  echo "DAPP_PRIVATE_KEY=${private_key}
DAPP_PUBLIC_KEY=${public_key}" > .env.local.client
  echo "DIALECT_SDK_CREDENTIALS=${private_key}" > .env.local
  solana airdrop 5 "$public_key" -u http://localhost:8899
fi


