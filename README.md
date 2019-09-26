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
|`/users/register`|POST| username, password, email, headerimage |
|`/users/update`|POST| info |
|`/users/reset/password`|POST|  oldPassword, newPassword, email |
|posts|——|——|
|`/posts/getposts`|GET| page(可选), userId(可选) |
|`/posts/addpost`|POST| userId, title, abstract, content |
|`/posts/updatepost`|POST| userId, postId, content |
