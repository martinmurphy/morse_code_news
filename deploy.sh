#!/bin/bash

docker run --rm -v ~/.aws:/root/.aws -v $(pwd):/aws amazon/aws-cli s3 sync --delete --acl public-read ./out s3://morse.mdp.im

