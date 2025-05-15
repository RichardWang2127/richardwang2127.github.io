#include<bits/stdc++.h>
using namespace std;
//line 8 08C01~04 Tc Mp M M Mp Tc or Tc Mp M M M Mp Tc
string trains[100][10];
string stringConvert(int p){
	string res="";
	while(p){
		res=char(p%10+'0')+res;
		p/=10;
	}
	return res;
}
int main(){
	freopen("08C01~04.txt","w",stdout);
	for(int Y=1;Y<=168;Y++){
		int A=(Y)/6+1;
		int X=(Y)%6;
		if(X==0){
			X=6;
			A--;
		}
		string Y_=stringConvert(Y);
		char t;
		if(X==1||X==6){
			t='1';
		}
		else if(X==2||X==5){
			t='2';
		}
		else{
			t='3';
		}
		string res=Y<100?"080":"08";
		if(Y<10){
			res="0800";
		}
		res=res+Y_+t;
		trains[A][X]=res;
	}
	for(int Y=169;Y<=602;Y++){
		int A=(Y)/7+5;
		int X=(Y)%7;
		if(X==0){
			X=7;
			A--;
		}
		string Y_=stringConvert(Y);
		char t;
		if(X==1||X==7){
			t='1';
		}
		else if(X==2||X==6){
			t='2';
		}
		else{
			t='3';
		}
		string res=Y<100?"080":"08";
		if(Y<10){
			res="0800";
		}
		res=res+Y_+t;
		trains[A][X]=res;
	}
	for(int i=1;i<=90;i++){
		bool first=true;
		cout<<"[";
		for(int j=1;j<=(i<=28?6:7);j++){
			if(!first){
				cout<<", ";
			}
			cout<<'"'<<trains[i][j]<<'"';
			first=false;
		}
		cout<<"],\n";
	}
	return 0;
}

