package main

import (
	"golang.org/x/crypto/bcrypt"
)

func hash(password string) string {
	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		panic(err)
	}
	return string(hash)
}

func CreateUser(user string, pass string) {
	db := GetDB()
	db.CreateAuthority(user, hash(pass))
}

func CheckPassword(user string, pass string) bool {
	db := GetDB()
	if bcrypt.CompareHashAndPassword([]byte(db.Auth(user)), []byte(pass)) == nil {
		return true
	}
	return false
}
