TAGGED=$1

build(){
  echo "----------------------------------------"
  IMAGE_TAGGED=r2ws/crypto-digging-$1:$TAGGED
  docker build --pull --tag $IMAGE_TAGGED --file services/$2/Dockerfile .
  docker push $IMAGE_TAGGED
  echo "Build image ${IMAGE_TAGGED} successfully"
  echo "----------------------------------------"
}

build main-events events