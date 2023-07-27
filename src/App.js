import React, {useEffect, useState} from 'react';
import './styles/App.css';
import PostList from './components/PostList';
import PostForm from './components/PostForm';
import PostFilter from './components/PostFilter';
import MyModal from './components/UI/button/MyModal/MyModal';
import MyButton from './components/UI/button/button/MyButton';
import { usePosts } from './hooks/usePosts';
import PostService from './API/PostService'
import Loader from './components/UI/button/Loader/Loader';
import { useFetching } from './hooks/useFetching';
import { getPageCount} from './utils/pages';
import Pagination from './components/UI/button/pagination/Pagination';




function App() {

  const [posts, setPosts] = useState([
    // {id: 1, title: 'qweqwe', body: 'asdasd'},
    // {id: 2, title: 'asdzxc 2', body: 'qwezxc'},
    // {id: 3, title: 'dfgcvb 3', body: 'cvbdsa'},
  ]);


  const [filter, setFilter] = useState({sort: '', query: ''})
  const [modal, setModal] = useState(false)
  const [totalPages, setTotalPages] = useState(0)
  const [limit, setLimit] = useState(10)
  const [page, setPage] = useState(1)
  const sortedAndSearchedPosts = usePosts(posts, filter.sort, filter.query);

  

  

  const [fetchPosts, isPostsLoading, postError] = useFetching( async(limit, page) => {
    const response = await PostService.getAll(limit, page)
    setPosts(response.data)
    const totalCount = response.headers['x-total-count']
    setTotalPages(getPageCount(totalCount, limit))
    // const response = await axios.get('https://jsonplaceholder.typicode.com/posts')
    // setPosts(response.data)
  })

  

  useEffect(() => {
    fetchPosts(limit, page)
  }, [])
  

  const createPost = (newPost) => {
    setPosts( [...posts, newPost])
    setModal(false)
  }  
  // Получаем пост из дочернего компонента
  function removePost(post) {
    console.log(post.id)
    setPosts(posts.filter(p => p.id !== post.id))
  }



  const changePage = (page) => {
    setPage(page)
    fetchPosts(limit, page)
  }

  
  return (
    <div className="App">
        <button onClick={fetchPosts}>GET POSTS</button>
        <MyButton style={{marginTop: 30}} onClick={() => setModal(true)}>
            Создать пост
        </MyButton>
        <MyModal visible={modal} setVisible={setModal}>
            <PostForm create={createPost} />
        </MyModal>
        
        <hr style={{margin: '15px 0'}}/>
        <PostFilter 
            filter={filter} 
            setFilter={setFilter}
        />
        {postError && 
            <h1>Произошла ошибка {postError}</h1>    
        }
        {isPostsLoading
            ? <div style={ {display: 'flex', justifyContent: 'center', marginTop: '50px'}}><Loader /></div>
            : <PostList 
                remove={removePost} 
                posts={sortedAndSearchedPosts} 
                title='Посты с севера' />
        }
        {/* {sortedAndSearchedPosts
            ? <h1 style={{textAlign: 'center'}}> Посты не найдены </h1>
            : <footer style={ {display: 'flex', justifyContent: 'center'} }> footer </footer>
            
        }     */}
        <Pagination 
            page={page} 
            changePage={changePage} 
            totalPages={totalPages} 
        />
        
    </div>
  );
}

export default App;
