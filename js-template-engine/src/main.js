var data = {
    profile: {
        name:
            '风暴降生丹妮莉丝，不焚者，弥林的女王，安达尔人，洛伊拿人和先民的女王，七国统治者暨全境守护者，大草海的卡丽熙，奴隶解放者，龙之母，跟男下属通奸者，卡奥终结者，寡妇制造者，寡妇村纵火者。',
        age: 28,
        weibo_name: '大飚哥带路',
        weibo_url: 'https://weibo.com/u/6257076674'
    },
    profile2: {
        name:
            '风暴降生丹妮莉丝，不焚者，弥林的女王，安达尔人，洛伊拿人和先民的女王，七国统治者暨全境守护者，大草海的卡丽熙，奴隶解放者，龙之母，跟男下属通奸者，卡奥终结者，寡妇制造者，寡妇村纵火者。',
        age: 28,
        repo: {
            author: 'wayou',
            author_url: 'https://github.com/wayou',
            repo_name: 'wayou.github.io',
            repo_url: 'https://github.com/wayou/wayou.github.io'
        },
        hobby: {
            weibo_name: '大飚哥带路',
            weibo_url: 'https://weibo.com/u/6257076674'
        }
    },
    foo: {
        bar: 'Bingo!'
    },
    greeting: {
        str1: 'hello,',
        str2: 'world!'
    },
    books: [
        {
            isbn: '1988',
            title: '《程序员的自我修养》',
            price: -1,
            desc: '程序员有自我修养我给你钱'
        },
        {
            isbn: '2045',
            title: '《程序员有没有自我修养》',
            price: 0,
            desc: '世纪之问，历史的拷问，扪心自问'
        },
        {
            isbn: '1984',
            title: '《程序员其实不在乎自我修养》',
            price: 998,
            desc: "Don't bb, show me the code"
        }
    ]
};

// document.getElementById('app').innerHTML = compile('#tpl_profile')(data.profile);
// document.getElementById('app').innerHTML = compile('#tpl_profile2')(data.profile2);
// document.getElementById('app').innerHTML = compile('#tpl_simple_with_exp')(data);
// document.getElementById('app').innerHTML = compile('#tpl_simple_with_exp_cls')(data);
document.getElementById('app').innerHTML = compile('#tpl_books')(data);
