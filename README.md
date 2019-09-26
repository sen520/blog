#### 环境

- mongodb（集群）
- redis
- node
- npm


#### api
|api|method|params|
|----|-----|----|
|users|——|——|
|`/users/login`|POST| email, password |
|`/users/register`|POST| username, password(必填), email(必填), headerimage |
|`/users/update`|POST| info |
|`/users/reset/password`|POST|  oldPassword(必填), newPassword(必填), email(必填) |
|posts|——|——|
|`/posts/getposts`|GET| page(可选), userId(可选) |
|`/posts/addpost`|POST| userId(必填), title, abstract, content |
