<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class TestController extends Controller
{
    public function register(Request $request){
        $incomingData = $request->validate([
            'Ten' => ['required', Rule::unique('users', 'Ten')],
            'email' => 'required',
            'password' => 'required',
        ]);
        $incomingData['password'] = bcrypt($incomingData['password']);
        $user = User::create($incomingData);
        auth()->login($user);
        return redirect('/');
    }
}
