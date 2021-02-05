import React, {Component} from 'react';
//import axios from 'axios';

function singIn(email, password){
    fetch("http://127.0.0.1:3300/login", 
    {
        method:'POST', 
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email: email, password: password})
            
    }).then(response => response.json())
            .then(res=> {
                alert(`${res.messege}`);
                let nav = document.getElementById('nav-list')
                nav.classList.remove('none')
                nav.classList.add('flex-nav')
                })
}

class Login extends Component{
    
    constructor(props){
        super(props)
        this.state ={
            email: '',
            password:''
        }
        this.changeEmail = this.changeEmail.bind(this)
        this.changePassword = this.changePassword.bind(this)
        //this.singIn = this.singIn.bind(this)
    }

    changeEmail(e) {
        this.setState({
            email: e.target.value
        })
    }

    changePassword(e) {
        this.setState({
            password: e.target.value
        })
    }

    
    
    render(){
        
        return (
                <div className ='login-form' action='/hola'>
                    <div className="mb-3">
                            <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                            <input 
                            type="email" 
                            className="form-control" 
                            id="exampleInputEmail1" 
                            aria-describedby="emailHelp" 
                            onChange={this.changeEmail} />

                            <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                    </div>
                    <div className="mb-3">
                            <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                            <input 
                            type="password" 
                            className="form-control" 
                            id="exampleInputPassword1" 
                            onChange={this.changePassword}
                            />
                    </div>
                    <button type="submit" className="btn btn-primary" id='login-button' 
                    >Login</button>
                </div>
        )
    }
    
    componentDidMount() {
        let button = document.getElementById('login-button');
        button.addEventListener('click', () => {
            singIn(this.state.email, this.state.password)
        })
    }

}
export default Login;